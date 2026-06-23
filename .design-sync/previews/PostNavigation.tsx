import { PostNavigation } from "julianosirtori.dev";
import { allPosts } from "contentlayer/generated";

const posts = allPosts
  .filter((p) => p.language === "en")
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

const labels = { prev: "Previous", next: "Next" };

export function PrevAndNext() {
  return (
    <div style={{ maxWidth: 720 }}>
      <PostNavigation
        prev={{ title: posts[1].title, slug: posts[1].slug }}
        next={{ title: posts[3].title, slug: posts[3].slug }}
        labels={labels}
      />
    </div>
  );
}

export function NextOnly() {
  return (
    <div style={{ maxWidth: 720 }}>
      <PostNavigation
        prev={null}
        next={{ title: posts[0].title, slug: posts[0].slug }}
        labels={labels}
      />
    </div>
  );
}
