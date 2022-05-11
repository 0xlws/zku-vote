export interface DiscordUser {
  roles: string;
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  user:{
    id: string,
    username: string
  }
}
