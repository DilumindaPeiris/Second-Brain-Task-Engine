const mongoose = require('mongoose');

// ──────────────────────────────────────────────
// Context Snippet Sub-Schema (embedded document)
// ──────────────────────────────────────────────
// Each snippet represents a piece of context attached to a task:
//   • "url"  — a web link (e.g., documentation, PR, Figma)
//   • "note" — a free-text note or memo
//   • "file" — a file path reference (local or remote)

const contextSnippetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: {
        values: ['url', 'note', 'file'],
        message: 'Snippet type must be url, note, or file',
      },
    },
    label: {
      type: String,
      required: [true, 'Snippet label is required'],
      trim: true,
      maxlength: [120, 'Label cannot exceed 120 characters'],
    },
    value: {
      type: String,
      required: [true, 'Snippet value is required'],
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true } // Each snippet gets its own ObjectId for targeted removal
);

// ──────────────────────────────────────────────
// Task Schema
// ──────────────────────────────────────────────

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: 'Status must be todo, in-progress, or done',
      },
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0, // Used to persist drag-and-drop ordering within a column
    },
    contextSnippets: [contextSnippetSchema],
  },
  {
    timestamps: true,
  }
);

// Compound index: fetch all tasks for a user, sorted by column order
taskSchema.index({ userId: 1, status: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);
