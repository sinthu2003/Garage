import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useBlogContent } from '../../hooks/useContentHooks';
import { Type, AlignLeft, Calendar, User, Image as ImageIcon, Tag, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const BlogEditor: React.FC = () => {
    const { updateField } = useContent();
    const blogContent = useBlogContent();
    const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([0]));

    const handleUpdate = (field: string, value: any) => {
        updateField('pages', `blog.${field}`, value);
    };

    const handlePostUpdate = (index: number, field: string, value: any) => {
        const updatedPosts = [...(blogContent.posts || [])];
        updatedPosts[index] = { ...updatedPosts[index], [field]: value };
        handleUpdate('posts', updatedPosts);
    };

    const togglePostExpansion = (index: number) => {
        const newExpanded = new Set(expandedPosts);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedPosts(newExpanded);
    };

    const addPost = () => {
        const newPost = {
            id: Date.now(),
            title: "New Blog Post",
            excerpt: "Write a short summary here...",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            author: "Admin",
            category: "General",
            image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1000",
            content: "Start writing your article..."
        };
        const updatedPosts = [...(blogContent.posts || []), newPost];
        handleUpdate('posts', updatedPosts);
        setExpandedPosts(new Set([...expandedPosts, updatedPosts.length - 1]));
    };

    const removePost = (index: number) => {
        const updatedPosts = (blogContent.posts || []).filter((_: any, i: number) => i !== index);
        handleUpdate('posts', updatedPosts);
    };

    return (
        <div className="space-y-8 p-4">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Blog Settings
                </h2>

                <div className="space-y-4 p-4 bg-secondary/20 rounded-xl border border-border">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Page Title</label>
                        <input
                            type="text"
                            value={blogContent.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Page Title"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Subtitle</label>
                        <input
                            type="text"
                            value={blogContent.subtitle || ''}
                            onChange={(e) => handleUpdate('subtitle', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Subtitle"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <AlignLeft className="w-5 h-5" />
                        Blog Posts
                    </h2>
                    <button
                        onClick={addPost}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Post
                    </button>
                </div>

                <div className="space-y-4">
                    {blogContent.posts?.map((post: any, index: number) => (
                        <div key={post.id || index} className="bg-secondary/20 rounded-xl border border-border overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                                onClick={() => togglePostExpansion(index)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium">{post.title || 'Untitled Post'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePost(index);
                                        }}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {expandedPosts.has(index) ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            {expandedPosts.has(index) && (
                                <div className="p-4 border-t border-border space-y-4 bg-background/50">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <Type className="w-3 h-3" /> Title
                                            </label>
                                            <input
                                                type="text"
                                                value={post.title || ''}
                                                onChange={(e) => handlePostUpdate(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <ImageIcon className="w-3 h-3" /> Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={post.image || ''}
                                                onChange={(e) => handlePostUpdate(index, 'image', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <User className="w-3 h-3" /> Author
                                            </label>
                                            <input
                                                type="text"
                                                value={post.author || ''}
                                                onChange={(e) => handlePostUpdate(index, 'author', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> Date
                                            </label>
                                            <input
                                                type="text"
                                                value={post.date || ''}
                                                onChange={(e) => handlePostUpdate(index, 'date', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <Tag className="w-3 h-3" /> Category
                                            </label>
                                            <input
                                                type="text"
                                                value={post.category || ''}
                                                onChange={(e) => handlePostUpdate(index, 'category', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Excerpt</label>
                                        <textarea
                                            value={post.excerpt || ''}
                                            onChange={(e) => handlePostUpdate(index, 'excerpt', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                                        />
                                    </div>

                                    {/* Note: In a real app we'd use a Rich Text Editor for content */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Content</label>
                                        <textarea
                                            value={post.content || ''}
                                            onChange={(e) => handlePostUpdate(index, 'content', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono text-muted-foreground"
                                            placeholder="Paste full article content..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
