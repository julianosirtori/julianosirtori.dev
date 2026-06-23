import { Guestbook } from "julianosirtori.dev";

export function Default() {
  return (
    <div style={{ maxWidth: 560, width: "100%" }}>
      <Guestbook
        placeholder={{ name: "Your name", message: "Leave a message..." }}
        submitText="Sign Guestbook"
        emptyText="No messages yet. Be the first to sign!"
      />
    </div>
  );
}
