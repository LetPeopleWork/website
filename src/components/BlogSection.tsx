import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type BlogPost = {
  title: string;
  link: string;
  date: string | null;
  displayDate: string;
  excerpt: string;
};

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, revealed } = useScrollReveal<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ transitionDelay: revealed ? `${index * 90}ms` : "0ms" }}
      className={`group flex flex-col rounded-2xl border border-border bg-white p-7 no-underline transition-all duration-700 ease-out hover:border-primary/20 hover:shadow-soft hover:-translate-y-0.5 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
        {post.displayDate}
      </span>
      <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug mb-3">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
          {post.excerpt}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Read on the blog
        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}

// Separate component so every useScrollReveal mounts only once the posts are
// loaded and the elements exist. Wiring the observers in the data-less parent
// would register them against null and the header would never reveal.
function BlogContent({ posts }: { posts: BlogPost[] }) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return (
    <section id="blog" className="pt-8 md:pt-10 pb-12 md:pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4 block">
              Blog and community
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Keep getting better at this.
            </h2>
          </div>
          <a
            href="https://blog.letpeople.work"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover whitespace-nowrap no-underline"
          >
            All posts
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.link} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/blog-data.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setPosts((data.posts ?? []).slice(0, 3)))
      .catch(() => setPosts([]));
  }, []);

  // No data, no section. The homepage should never show an empty shell.
  if (posts.length === 0) return null;

  return <BlogContent posts={posts} />;
};

export default BlogSection;
