﻿using BetterCms.Module.Api.Operations.Root.Categories;
using BetterCms.Module.Api.Operations.Root.Categories.Category;
using BetterCms.Module.Api.Operations.Root.Layouts;
using BetterCms.Module.Api.Operations.Root.Layouts.Layout;
using BetterCms.Module.Api.Operations.Root.Tags;
using BetterCms.Module.Api.Operations.Root.Version;

using ITagService = BetterCms.Module.Api.Operations.Root.Tags.Tag.ITagService;

namespace BetterCms.Module.Api.Operations.Root
{
    public class DefaultRootApiOperations : IRootApiOperations
    {
        public DefaultRootApiOperations(ITagsService tags, ITagService tag, IVersionService version, ILayoutsService layouts, ILayoutService layout,
            ICategoriesService categories, ICategoryService category)
        {
            Tags = tags;
            Tag = tag;
            Categories = categories;
            Category = category;
            Version = version;
            Layouts = layouts;
            Layout = layout;
        }

        public ITagsService Tags
        {
            get; 
            private set;
        }

        public ITagService Tag
        {
            get;
            private set;
        }
        
        public ICategoriesService Categories
        {
            get; 
            private set;
        }

        public ICategoryService Category
        {
            get;
            private set;
        }

        public IVersionService Version
        {
            get;
            private set;
        }

        public ILayoutsService Layouts
        {
            get;
            private set;
        }

        public ILayoutService Layout
        {
            get;
            private set;
        }
    }
}