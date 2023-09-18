import { Html } from "@react-email/html";

type TEmailTemplateProps = {
  name: string;
  email: string;
  message: string;
};

export default function EmailTemplate({
  name,
  email,
  message,
}: TEmailTemplateProps) {
  return (
    <Html>
      <ul>
        <li>
          <strong>Name:</strong> {name}
        </li>
        <li>
          <strong>Email:</strong> {email}
        </li>
        <li>
          <strong>Message:</strong> {message}
        </li>
      </ul>
    </Html>
  );
}
