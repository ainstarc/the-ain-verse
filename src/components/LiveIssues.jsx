import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronRight, FaStream } from "react-icons/fa";
import config from "../utils/config";
import "../styles/LiveIssues.css";

const LiveIssues = ({ show, toggleIssuesPanel }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [expandedRepos, setExpandedRepos] = useState({});

  useEffect(() => {
    if (show) {
      fetchLiveIssues();
    }
  }, [show]);

  useEffect(() => {
    filterIssues();
  }, [searchTerm, issues]);

  const fetchLiveIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.api.issues(config.githubUsername));
      if (!response.ok) throw new Error("Failed to fetch issues");

      const data = await response.json();
      setIssues(data.items || []);

      // Initialize all repos as expanded
      const repos = {};
      data.items?.forEach((issue) => {
        const repoName = getRepoName(issue);
        repos[repoName] = true;
      });
      setExpandedRepos(repos);
    } catch (error) {
      console.error("Error fetching live issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    if (!searchTerm.trim()) {
      setFilteredIssues(issues);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = issues.filter((issue) => {
      // Always check labels (without requiring label: prefix)
      const matchesLabel = issue.labels?.some((label) =>
        label.name.toLowerCase().includes(searchLower)
      );

      // Also check title and body
      const matchesTitle = issue.title.toLowerCase().includes(searchLower);
      const matchesBody =
        issue.body && issue.body.toLowerCase().includes(searchLower);

      return matchesLabel || matchesTitle || matchesBody;
    });

    setFilteredIssues(filtered);
  };

  const getRepoName = (issue) => {
    return issue.repository_url.split("/").pop();
  };

  const toggleRepoExpand = (repoName) => {
    setExpandedRepos((prev) => ({
      ...prev,
      [repoName]: !prev[repoName],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group issues by repository
  const groupIssuesByRepo = (issues) => {
    const grouped = {};

    issues.forEach((issue) => {
      const repoName = getRepoName(issue);
      if (!grouped[repoName]) {
        grouped[repoName] = [];
      }
      grouped[repoName].push(issue);
    });

    return grouped;
  };

  const groupedIssues = groupIssuesByRepo(filteredIssues);

  return (
    <>
      <aside
        id="live-issues-section"
        className={`live-issues-sidebar ${show ? "active" : ""}`}
        aria-labelledby="live-issues-heading"
      >
        <div className="live-issues-header">
          <h2 id="live-issues-heading" className="visually-hidden">
            Live GitHub Issues
          </h2>
          <input
            type="search"
            className="live-issues-search"
            placeholder="Search issues or labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search issues"
          />
          <div className="live-issues-search-count">
            {searchTerm ? (
              <>
                Found {filteredIssues.length} of {issues.length}{" "}
                {issues.length === 1 ? "issue" : "issues"}
              </>
            ) : (
              <>
                Total: {issues.length}{" "}
                {issues.length === 1 ? "issue" : "issues"}
              </>
            )}
          </div>
        </div>

        <div className="live-issues-scrollable">
          {loading ? (
            <div className="loading-issues">Loading issues...</div>
          ) : filteredIssues.length > 0 ? (
            Object.entries(groupedIssues).map(([repoName, repoIssues]) => (
              <div key={repoName} className="repo-group">
                <div
                  className="repo-group-header"
                  onClick={() => toggleRepoExpand(repoName)}
                >
                  {expandedRepos[repoName] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                  {repoName}
                  <span className="issue-count">{repoIssues.length}</span>
                </div>

                {expandedRepos[repoName] && (
                  <ul className="repo-group-issues">
                    {repoIssues.map((issue) => (
                      <li key={issue.id} className="issue-item">
                        <a
                          href={issue.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="issue-link"
                        >
                          <div className="issue-title">
                            <span className="issue-number">
                              #{issue.number}
                            </span>
                            {issue.title}
                          </div>

                          {issue.labels && issue.labels.length > 0 && (
                            <div className="issue-labels">
                              {issue.labels.map((label) => (
                                <span
                                  key={label.id}
                                  className="issue-label"
                                  style={{
                                    backgroundColor: `#${label.color}`,
                                    color:
                                      parseInt(label.color, 16) > 0xffffff / 2
                                        ? "#000"
                                        : "#fff",
                                  }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="issue-meta">
                            <span className="issue-date">
                              Updated: {formatDate(issue.updated_at)}
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="no-issues">
              {searchTerm ? "No matching issues found" : "No open issues found"}
            </div>
          )}
        </div>
      </aside>

      <button
        id="live-issues-toggle"
        aria-expanded={show}
        aria-label="Toggle Issues Panel"
        aria-controls="live-issues-section"
        onClick={toggleIssuesPanel}
      >
        <FaStream className="toggle-icon" />
        <span className="toggle-text">ISSUES</span>
      </button>
    </>
  );
};

export default LiveIssues;
