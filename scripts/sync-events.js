import fs from 'fs';
import Parser from 'rss-parser';
import axios from 'axios';

const parser = new Parser();

async function fetchMeetupEvents() {
  try {
    console.log('📅 Fetching Meetup events via RSS feed...');
    const feed = await parser.parseURL('https://www.meetup.com/lighthouselive//events/rss/');

    const events = [];

    const dateRegex = /(\b\d{2})\.(\d{2})\.(\d{4})\b/; // DD.MM.YYYY
    const timeRegex = /(\b\d{1,2}:\d{2}\b)/; // HH:MM

    for (const item of feed.items) {
      const content = item.contentSnippet || item.content || '';

      let eventDate = null;
      const dateMatch = content.match(dateRegex);
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        eventDate = new Date(`${year}-${month}-${day}T00:00:00`);
        if (eventDate <= new Date()) continue; // filter past events
      }

      let timeText = '';
      const timeMatch = content.match(timeRegex);
      if (timeMatch) timeText = timeMatch[0];

      events.push({
        type: "Meetup",
        title: item.title,
        date: eventDate ? eventDate.toISOString() : null,
        displayDate: eventDate ? formatDate(eventDate) : 'TBD',
        time: timeText,
        location: 'Online',
        price: 'Free',
        description: content.substring(0, 300) + '...',
        ctaText: 'RSVP on Meetup',
        ctaLink: item.link,
        source: 'meetup'
      });
    }

    console.log(`✅ Fetched ${events.length} Meetup events`);
    return events;
  } catch (error) {
    console.error('❌ Meetup RSS error:', error.message);
    return [];
  }
}

async function fetchTicketTailorEvents() {
  try {
    const TICKET_TAILOR_API_KEY = process.env.TICKET_TAILOR_API_KEY;
    if (!TICKET_TAILOR_API_KEY) return [];

    const response = await axios.get('https://api.tickettailor.com/v1/events', {
      params: { status: 'published', start_at_gte: new Date().toISOString() },
      headers: { Authorization: `Basic ${Buffer.from(TICKET_TAILOR_API_KEY + ':').toString('base64')}`, Accept: 'application/json' }
    });

    const now = new Date();
    return response.data.data
      .filter(event => new Date(event.start.date) > now)
      .map(event => {
        const eventDate = new Date(event.start.date);
        const prices = event.ticket_types?.map(t => t.price / 100) || [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

        // Map currency codes to symbols
        const currencySymbol = {
          'eur': '€',
          'usd': '$',
          'chf': 'CHF'
        }[event.currency?.toLowerCase()] || '$';

        let priceDisplay = 'Free';
        if (minPrice && maxPrice) priceDisplay = minPrice === maxPrice ? `${currencySymbol}${minPrice}` : `${currencySymbol}${minPrice} - ${currencySymbol}${maxPrice}`;

        return {
          type: determineEventType(event.description),
          title: event.name,
          date: event.start.date,
          displayDate: formatDate(eventDate),
          time: `${formatTime(eventDate)} - ${formatTime(new Date(event.end.date))} ${event.start.timezone}`,
          location: event.venue?.name || 'Online',
          price: priceDisplay,
          description: stripHtml(event.description).substring(0, 300) + '...',
          ctaText: 'Buy Tickets',
          ctaLink: event.url,
          source: 'tickettailor'
        };
      });
  } catch (error) {
    console.error('❌ Ticket Tailor API error:', error.message);
    return [];
  }
}

function determineEventType(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('workshop')) return ['Workshop'];
  if (titleLower.includes('training') || titleLower.includes('course')) return ['Training'];
  if (titleLower.includes('talk') || titleLower.includes('presentation')) return ['Talk'];
  if (titleLower.includes('conference') || titleLower.includes('summit')) return ['Conference'];
  return ['Talk'];
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('🚀 Starting event sync...\n');

  const [meetupEvents, ticketTailorEvents] = await Promise.all([fetchMeetupEvents(), fetchTicketTailorEvents()]);
  const allEvents = [...meetupEvents, ...ticketTailorEvents].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  const output = { events: allEvents };
  fs.writeFileSync('public/events-data.json', JSON.stringify(output, null, 2));

  console.log(`\n✨ Successfully synced ${allEvents.length} total events`);
  console.log(`   - Meetup: ${meetupEvents.length}`);
  console.log(`   - Ticket Tailor: ${ticketTailorEvents.length}`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
