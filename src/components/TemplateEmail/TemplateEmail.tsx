import { Html } from "@react-email/html";

type TEmailTemplateProps = {
  name: string;
  email: string;
  companyOrProject: string;
  collaborationType: string;
  message: string;
};

export default function EmailTemplate({
  name,
  email,
  companyOrProject,
  collaborationType,
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
          <strong>Company or project:</strong> {companyOrProject}
        </li>
        <li>
          <strong>Collaboration type:</strong> {collaborationType}
        </li>
        <li>
          <strong>Message:</strong> {message}
        </li>
      </ul>
    </Html>
  );
}
