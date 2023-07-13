import { TIcon } from "../types";
import IconDiscord from "./IconDiscord";
import IconEmail from "./IconEmail";
import IconFigma from "./IconFigma";
import IconGithub from "./IconGithub";
import IconLandmark from "./IconLandmark";
import IconLinkedin from "./IconLinkedin";
import IconLogo from "./IconLogo";
import IconTwitter from "./IconTwitter";

export const IconsMaps = {
  IconDiscord: (props: TIcon) => <IconDiscord {...props} />,
  IconEmail: (props: TIcon) => <IconEmail {...props} />,
  IconFigma: (props: TIcon) => <IconFigma {...props} />,
  IconGithub: (props: TIcon) => <IconGithub {...props} />,
  IconLandmark: (props: TIcon) => <IconLandmark {...props} />,
  IconLinkedin: (props: TIcon) => <IconLinkedin  {...props} />,
  IconLogo: (props: TIcon) => <IconLogo {...props} />,
  IconTwitter: (props: TIcon) => <IconTwitter {...props} />,
}