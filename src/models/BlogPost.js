import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  alt: {
    type: String,
    required: [true, 'Alt text is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  metaTitle: {
    type: String,
    required: [true, 'Meta title is required'],
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required'],
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  next();
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema); 