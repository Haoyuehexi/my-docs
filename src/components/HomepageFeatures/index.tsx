import React, { useState, useMemo } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
// Import the custom data from a separate file
import { customDocsData } from "../../data/docsData";

interface DocumentCard {
  id: string;
  title: string;
  description: string;
  permalink: string;
  category: string;
  lastUpdatedAt?: number;
  tags?: string[];
}

const DocumentCardComponent: React.FC<DocumentCard> = ({
  title,
  description,
  permalink,
  category,
  lastUpdatedAt,
  tags = [],
}) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString("zh-CN");
  };

  return (
    <Link
      to={permalink}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200 no-underline hover:no-underline"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">
            {description || "暂无描述"}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {category}
          </span>
          {lastUpdatedAt && <span>{formatDate(lastUpdatedAt)}</span>}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

const CategorySidebarComponent: React.FC<{
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}> = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">文档分类</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onCategorySelect("all")}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            所有文档
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedCategory === category
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HomePage: React.FC = () => {
  const allDocsData = useAllDocsData();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { documents, categories } = useMemo(() => {
    const docs: DocumentCard[] = [];
    const categorySet = new Set<string>();

    Object.entries(allDocsData).forEach(([pluginId, docsData]) => {
      const { versions } = docsData;

      versions.forEach((version) => {
        Object.entries(version.docs).forEach(([docId, doc]: [string, any]) => {
          const frontMatter = doc.frontMatter || {};
          const fileName = doc.id.split("/").pop();

          if (fileName === "intro") {
            // Get custom data from the imported object
            const customData = customDocsData[pluginId] || {};

            let category =
              customData.category ||
              (pluginId === "default" ? "Tutorial" : pluginId);

            categorySet.add(category);

            docs.push({
              id: docId,
              // Use custom data, falling back to frontMatter or a default value
              title: customData.title || frontMatter.title || "Untitled",
              description:
                customData.description || frontMatter.description || "暂无描述",
              permalink: doc.path,
              category: customData.category,
              lastUpdatedAt: doc.lastUpdatedAt ?? null,
              tags: customData.tags || frontMatter.tags || [],
            });
          }
        });
      });
    });

    return {
      documents: docs,
      categories: Array.from(categorySet).sort(),
    };
  }, [allDocsData]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      return selectedCategory === "all" || doc.category === selectedCategory;
    });
  }, [documents, selectedCategory]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">文档中心</h1>
        <p className="text-xl text-gray-600">浏览我们的文档、教程和 API 参考</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {selectedCategory === "all" ? "所有文档" : selectedCategory}
              <span className="text-lg text-gray-500 ml-2">
                ({filteredDocuments.length})
              </span>
            </h2>
          </div>

          <div className="grid gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCardComponent key={doc.id} {...doc} />
            ))}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">没有找到匹配的文档</div>
                <div className="text-sm text-gray-400 mt-2">
                  尝试选择不同的分类
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CategorySidebarComponent
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
