import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  alt: {
    type: String,
    required: [true, 'Please provide an alt text for the image'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  metaTitle: {
    type: String,
    required: [true, 'Please provide a meta title'],
    maxlength: [60, 'Meta title cannot be more than 60 characters'],
  },
  metaDescription: {
    type: String,
    required: [true, 'Please provide a meta description'],
    maxlength: [160, 'Meta description cannot be more than 160 characters'],
  },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 