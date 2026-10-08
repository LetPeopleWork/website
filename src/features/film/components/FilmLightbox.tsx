import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { LIGHTHOUSE_FILM, filmEmbedUrl } from "../lighthouseFilm";

interface FilmLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// The film in a modal, for the homepage hero: the page stays light and quiet,
// the film is one click away with sound. The iframe mounts only while open,
// so closing stops playback and nothing from YouTube loads until the visitor
// asks for it.
//
// Focus goes to our own close button, never the iframe: once an iframe holds
// focus, key presses stay inside YouTube's document and Escape never reaches
// the dialog. The button is first in DOM order and gets focus on open.
const FilmLightbox = ({ open, onOpenChange }: FilmLightboxProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="max-w-5xl border-0 bg-black p-0 sm:rounded-2xl overflow-visible [&>button:last-child]:hidden"
      data-testid="film-lightbox"
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        (event.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-film-close]")?.focus();
      }}
    >
      <DialogTitle className="sr-only">{LIGHTHOUSE_FILM.title}</DialogTitle>
      <DialogClose
        data-film-close
        className="absolute -top-10 right-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close film"
      >
        Close <X className="h-4 w-4" />
      </DialogClose>
      {open && (
        <div className="aspect-video w-full overflow-hidden sm:rounded-2xl">
          <iframe
            className="h-full w-full"
            src={filmEmbedUrl()}
            title={LIGHTHOUSE_FILM.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default FilmLightbox;
