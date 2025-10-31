import PeterImage from '../assets/Peter.png';
import BenjiImage from '../assets/Benji.png';

const ExpertiseSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-background/80 backdrop-blur-sm rounded-2xl p-12 border border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Why Choose Our Expertise?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
            {/* Peter's section */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Peter Zylka-Greger</h3>
                <img 
                  src={PeterImage} 
                  alt="Peter Zylka-Greger - Flow and Kanban Expert" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
              <p className="text-muted-foreground">
                For years I have been working with teams worldwide, experiencing what great teams can achieve. 
                But also seeing that success isn't just about putting individuals together—it requires the right 
                techniques, emotional intelligence, and toolkit.
              </p>
              <p className="text-muted-foreground">
                We see frustrated team members, overwhelmed managers, and complaining customers because people 
                are drowning in meetings instead of delivering value. People want to contribute and be part of 
                something successful—we just need to let them work.
              </p>
            </div>

            {/* Benjamin's section */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Benjamin Huser-Berta</h3>
                <img 
                  src={BenjiImage} 
                  alt="Benjamin Huser-Berta - Software Engineer and Scrum Master" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
              <p className="text-muted-foreground">
                As a Software Engineer and Scrum Master, I've seen teams struggle with wasteful processes 
                and overwhelming workloads that kill motivation. I believe work can be creative and fun when 
                we reduce waste and create environments focused on delivering value.
              </p>
              <p className="text-muted-foreground">
                We bring you everything you need: the tools, know-how, and real-world experience. 
                Unlike traditional consultancies, we create the tools we recommend and have hands-on 
                experience making them work in complex organizational environments.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-primary mb-4">
              We don't just give advice—we build the tools and have proven they work.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our unique combination of tool creation, practical implementation experience, and deep 
              methodological expertise means you get solutions that actually work in the real world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;