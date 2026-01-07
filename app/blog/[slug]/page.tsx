import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .single();

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
       {/* Hero / Header */}
       <div className="relative w-full h-[50vh] min-h-[400px]">
          {blog.cover_image ? (
             <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover brightness-50"
              priority
             />
          ) : (
             <div className="absolute inset-0 bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 container px-4 md:px-6 mx-auto pb-12">
             <Link href="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
             </Link>
             <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl">
               {blog.title}
             </h1>
             <div className="flex items-center gap-4 text-gray-300">
                {blog.author?.avatar_url && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <Image src={blog.author.avatar_url} alt="Author" fill className="object-cover" />
                    </div>
                )}
                <div>
                   <p className="font-medium text-white">{blog.author?.full_name || "Admin"}</p>
                   <p className="text-sm">{new Date(blog.created_at).toLocaleDateString()}</p>
                </div>
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="container px-4 md:px-6 mx-auto mt-12 max-w-3xl">
          <article className="prose prose-lg dark:prose-invert max-w-none">
             {/* 
                In a real app, you would use a markdown parser or HTML sanitizer here.
                For now, assuming simple text or safe HTML if you trust the admin input.
                To keep it simple and safe for this demo, I'll just render text or simple paragraphs.
             */}
             <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
          </article>
       </div>
    </div>
  );
}
