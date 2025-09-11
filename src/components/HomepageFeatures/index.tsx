import React, { useState, useMemo, useEffect } from "react";
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import { customDocsData } from "../../data/docsData";

interface DocumentCard {
  id: string;
  title: string;
  description: string;
  permalink: string;
  category: string; // 存储标准化后的值（小写）
  lastUpdatedAt?: number;
  tags?: string[];
}

// 工具函数：美化显示 category（首字母大写）
const capitalize = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DocumentListItem: React.FC<DocumentCard> = ({
  title,
  description,
  permalink,
  category, // 内部是小写
  lastUpdatedAt,
  tags = [],
}) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString("zh-CN");
  };

  return (
    <article className="blog-doc-item">
      <div className="blog-doc-content">
        <h2 className="blog-doc-title">
          <Link to={permalink} className="blog-doc-link">
            {title}
          </Link>
        </h2>

        <div className="blog-doc-meta">
          <span className="blog-doc-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {formatDate(lastUpdatedAt)}
          </span>

          <span className="blog-doc-category">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {capitalize(category)} {/* 显示时美化 */}
          </span>

          {tags.map((tag, index) => (
            <span key={index} className="blog-doc-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

const CategorySidebar: React.FC<{
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}> = ({ categories, tags, selectedCategory, onCategorySelect }) => {
  return (
    <div className="blog-sidebar">
      <div className="blog-sidebar-section">
        <h3 className="blog-sidebar-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Categories 类别
        </h3>
        <ul className="blog-sidebar-list">
          <li>
            <button
              onClick={() => onCategorySelect("all")}
              className={`blog-sidebar-item ${
                selectedCategory === "all" ? "active" : ""
              }`}
            >
              <span className="blog-sidebar-item-text">所有文档</span>
              <span className="blog-sidebar-item-count">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.name}>
              <button
                onClick={() => onCategorySelect(category.name)}
                className={`blog-sidebar-item ${
                  selectedCategory === category.name ? "active" : ""
                }`}
              >
                <span className="blog-sidebar-item-text">
                  {capitalize(category.name)} {/* 显示时美化 */}
                </span>
                <span className="blog-sidebar-item-count">
                  {category.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="blog-sidebar-section">
        <h3 className="blog-sidebar-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="7"
              y1="7"
              x2="7.01"
              y2="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Tags 标签
        </h3>
        <div className="blog-tags-grid">
          {tags.slice(0, 15).map((tag) => (
            <span key={tag.name} className="blog-tag-item">
              {tag.name}
              <span className="blog-tag-count">{tag.count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const allDocsData = useAllDocsData();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ 核心修改：标准化 category + 确保每次返回新数组引用
  const { documents, categories, allTags } = useMemo(() => {
    const docs: DocumentCard[] = []; // 每次全新数组
    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();

    Object.entries(allDocsData).forEach(([pluginId, docsData]) => {
      const { versions } = docsData;

      versions.forEach((version) => {
        Object.entries(version.docs).forEach(([docId, doc]: [string, any]) => {
          const frontMatter = doc.frontMatter || {};
          const fileName = doc.id.split("/").pop();

          if (fileName === "intro") {
            const customData = customDocsData[pluginId] || {};

            // ✅ 标准化 category：统一小写 + trim
            let rawCategory =
              customData.category ||
              (pluginId === "default" ? "tutorial" : pluginId);
            let category = rawCategory.trim().toLowerCase();

            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

            const docTags = customData.tags || frontMatter.tags || [];
            docTags.forEach((tag) => {
              tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });

            docs.push({
              id: `${pluginId}/${docId}`,
              title: customData.title || frontMatter.title || "Untitled",
              description:
                customData.description || frontMatter.description || "暂无描述",
              permalink: doc.path,
              category, // ✅ 存储标准化后的值
              lastUpdatedAt: doc.lastUpdatedAt ?? null,
              tags: docTags,
            });
          }
        });
      });
    });

    const categoriesArray = Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const tagsArray = Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // ✅ 确保返回全新数组引用，避免 useMemo 缓存不更新
    return {
      documents: [...docs].sort(
        (a, b) => (b.lastUpdatedAt || 0) - (a.lastUpdatedAt || 0)
      ),
      categories: [...categoriesArray],
      allTags: [...tagsArray],
    };
  }, [allDocsData]);

  // ✅ 核心修改：过滤时也标准化 selectedCategory + 强依赖 documents 引用
  const filteredDocuments = useMemo(() => {
    const target =
      selectedCategory === "all"
        ? "all"
        : selectedCategory.trim().toLowerCase();

    return documents.filter((doc) => {
      if (target === "all") return true;
      return doc.category === target; // ✅ doc.category 已标准化
    });
  }, [documents, selectedCategory]); // ✅ 依赖项完整

  // 🧪 可选：调试日志（上线前可移除）
  useEffect(() => {
    console.log("🎯 Selected Category:", selectedCategory);
    console.log("📄 Filtered Document Count:", filteredDocuments.length);
    console.log(
      "📄 Filtered Docs Titles:",
      filteredDocuments.map((d) => d.title)
    );
  }, [filteredDocuments, selectedCategory]);

  return (
    <div className="blog-layout-container">
      <div className="blog-container">
        <header className="blog-header-wrapper">
          <div className="blog-header-content">
            <h1 className="blog-main-title">文档中心</h1>
            <p className="blog-main-subtitle">技术文档 · 教程指南 · 开源项目</p>
          </div>
        </header>

        <div className="blog-content-wrapper">
          <main className="blog-main-content">
            {filteredDocuments.map((doc) => (
              <DocumentListItem key={doc.id} {...doc} />
            ))}

            {filteredDocuments.length === 0 && (
              <div className="blog-empty-state">
                <p>没有找到匹配的文档</p>
              </div>
            )}
          </main>

          <aside className="blog-sidebar-wrapper">
            <CategorySidebar
              categories={categories}
              tags={allTags}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
