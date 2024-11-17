export class CreatePostDto {
  title: string;
  postType: string;
  slug: string;
  status: string;
  content?: string;
  schema?: string;
  featuredImageUrl?: string;
  publishOn: Date;
  tags: string[];
  metaOptions: { [key: string]: string }[];
}
