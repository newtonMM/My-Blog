export interface IArticle {
  title: string;
  content: string;
  author_id: string;
  image_url: string;
  series_id: string | null;
  category_id: string;
}
