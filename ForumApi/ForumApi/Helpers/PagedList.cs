﻿using ForumApi.Data.Dtos.General;
using Microsoft.EntityFrameworkCore;

namespace ForumApi.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }

        public bool HasPrevious
        {
            get
            {
                return CurrentPage > 1;
            }
        }

        public bool HasNext
        {
            get
            {
                return CurrentPage < TotalPages;
            }
        }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            int count = source.Count();
            List<T> items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }

        public Metadata GetMetadata()
        {
            return new Metadata(TotalCount, PageSize, CurrentPage, TotalPages);
        }
    }
}
