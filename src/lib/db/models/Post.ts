import mongoose, { Schema, Types, type Model, type Document } from 'mongoose';
import type { BlogFAQ, BlogPostStatus, BlogSection, BlogStat, BlogTable } from '@/lib/blog-types';

// Mirrors BlogPost/BlogSection exactly (src/lib/blog-types.ts) plus two
// admin-only fields: `status` (draft/published gate for the public site)
// and `source` (migrated | admin, for telling the original 20 posts apart
// from anything created through the admin panel, audit-trail purposes
// only, not used by any query).

const BlogTableSchema = new Schema<BlogTable>(
  {
    headers: { type: [String], required: true },
    rows: { type: [[String]], required: true },
  },
  { _id: false }
);

const BlogStatSchema = new Schema<BlogStat>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const BlogSectionSchema = new Schema<BlogSection>(
  {
    heading: { type: String },
    paragraphs: { type: [String], required: true, default: [] },
    table: { type: BlogTableSchema },
    pullQuote: { type: String },
    stat: { type: BlogStatSchema },
  },
  { _id: false }
);

const BlogFAQSchema = new Schema<BlogFAQ>(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
  },
  { _id: false }
);

export interface PostDocument extends Document {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  domain?: string;
  content?: string[];
  sections?: BlogSection[];
  keyTakeaways?: string[];
  faqs?: BlogFAQ[];
  ctaLabel?: string;
  ctaHref?: string;
  status: BlogPostStatus;
  source: 'migrated' | 'admin';
  createdAt: Date;
  updatedDocAt: Date;
}

// `.lean()` queries return plain JS objects, not real Mongoose Documents --
// typing them as PostDocument (which extends Document) would be a lie: a
// lean result has no Document methods, and its `_id` is a plain
// mongoose.Types.ObjectId rather than whatever Document's generic resolves
// to. This is the type every `.lean<...>()` call in blog-repo.ts and
// admin-post-repo.ts should actually use.
export type PostLean = Omit<PostDocument, keyof Document> & { _id: Types.ObjectId };

const PostSchema = new Schema<PostDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: { type: String, required: true },
    publishedAt: { type: String, required: true },
    updatedAt: { type: String },
    readingTime: { type: String, required: true },
    domain: { type: String },
    content: { type: [String] },
    sections: { type: [BlogSectionSchema] },
    keyTakeaways: { type: [String] },
    faqs: { type: [BlogFAQSchema] },
    ctaLabel: { type: String },
    ctaHref: { type: String },
    status: { type: String, enum: ['draft', 'published'], required: true, default: 'draft' },
    source: { type: String, enum: ['migrated', 'admin'], required: true, default: 'admin' },
  },
  {
    // `timestamps: true` gives createdAt/updatedAt Date fields for admin
    // sorting; named `updatedDocAt` in the TS interface above only to avoid
    // colliding with the pre-existing string `updatedAt` field (the post's
    // own "genuinely revised" editorial date, a different concept).
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedDocAt' },
  }
);

// Compound index matches the two real query shapes: public site always
// filters status + sorts by publishedAt; admin dashboard lists everything
// sorted by recency.
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ domain: 1, status: 1 });

export const Post: Model<PostDocument> =
  (mongoose.models.Post as Model<PostDocument>) || mongoose.model<PostDocument>('Post', PostSchema);
