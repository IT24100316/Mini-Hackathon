import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const categories = [
  { id: "potholes", label: "Potholes", note: "Damaged and uneven roads", icon: "RD" },
  { id: "garbage", label: "Garbage", note: "Overflowing or illegal dumping", icon: "GB" },
  { id: "drains", label: "Blocked Drains", note: "Water clogging and floods", icon: "DR" },
  { id: "streetlights", label: "Broken Streetlights", note: "Unsafe dark roads", icon: "LT" },
  { id: "water", label: "Water Leaks", note: "Pipe leaks and wastage", icon: "WT" },
];

const featuredIssues = [
  {
    id: "FMA-2024-000123",
    category: "Pothole",
    location: "Kottawa, Pannipitiya Rd",
    description: "Large pothole near the bus stand. Vehicles are getting damaged.",
    severity: "high",
    status: "pending",
    date: "May 20, 2024",
    image:
      "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "FMA-2024-000122",
    category: "Garbage",
    location: "Maharagama, 1st Lane",
    description: "Garbage has not been collected for the last 3 days.",
    severity: "medium",
    status: "in_progress",
    date: "May 19, 2024",
    image:
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "FMA-2024-000121",
    category: "Blocked Drain",
    location: "Nugegoda, Lake Rd",
    description: "Drain is blocked and water is overflowing onto the road.",
    severity: "high",
    status: "pending",
    date: "May 18, 2024",
    image:
      "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "FMA-2024-000120",
    category: "Broken Streetlight",
    location: "Dehiwala, Station Rd",
    description: "Streetlight has stopped working at night.",
    severity: "low",
    status: "resolved",
    date: "May 17, 2024",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
];

const districts = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara"];
const severityOptions = [
  { value: "low", label: "Low", note: "Can wait a few days" },
  { value: "medium", label: "Medium", note: "Needs attention soon" },
  { value: "high", label: "High", note: "Dangerous or urgent" },
];
const adminStatuses = ["pending", "in_progress", "resolved", "closed"];

function Logo({ onNavigate }) {
  return (
    <button className="logo" type="button" onClick={() => onNavigate("home")}>
      <span className="logo-mark">F</span>
      <span>FixMyArea LK</span>
    </button>
  );
}

function Header({ page, onNavigate }) {
  const links = [
    ["home", "Home"],
    ["report", "Report Issue"],
  ];

  return (
    <header className="site-header">
      <Logo onNavigate={onNavigate} />
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([id, label]) => (
          <button
            className={page === id ? "active" : ""}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="primary-btn small" type="button" onClick={() => onNavigate("report")}>
          Report Issue
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <h1>
          Let&apos;s Fix Our Area, <span>Together.</span>
        </h1>
        <p>
          FixMyArea LK helps communities report potholes, garbage, blocked drains,
          broken streetlights, and water leaks so local teams can act faster.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={() => onNavigate("report")}>
            Report an Issue
          </button>
        </div>
      </div>
      <div className="city-scene" aria-hidden="true">
        <div className="sun" />
        <div className="skyline" />
        <div className="tree tree-one" />
        <div className="tree tree-two" />
        <div className="road" />
        <div className="bin" />
        <div className="bags" />
        <div className="lamp" />
      </div>
    </section>
  );
}

function HomePage({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <section className="section">
        <div className="section-heading">
          <h2>Common Issues</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <span>{category.icon}</span>
              <h3>{category.label}</h3>
              <p>{category.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-band">
        <div>
          <h2>Why It Matters</h2>
          <p>
            Many neighborhood issues stay unreported for too long. A simple,
            trackable report helps the right authority identify the problem and
            respond with better context.
          </p>
        </div>
        <div className="community-badge">
          <span>Together for</span>
          <strong>a Better Sri Lanka</strong>
        </div>
      </section>

      <section className="impact-bar" aria-label="Community impact">
        <Stat value="120+" label="Issues Reported" />
        <Stat value="85+" label="Issues Resolved" />
        <Stat value="50+" label="Active Users" />
        <Stat value="15+" label="Areas Covered" />
      </section>

      <section className="section">
        <div className="section-heading with-action">
          <div>
            <h2>Featured Issues</h2>
            <p>Recent reports from the community.</p>
          </div>
          <button className="secondary-btn" type="button" onClick={() => onNavigate("issues")}>
            View All
          </button>
        </div>
        <IssueGrid issues={featuredIssues.slice(0, 3)} />
      </section>

      <section className="final-cta">
        <h2>See a problem in your area?</h2>
        <button className="primary-btn" type="button" onClick={() => onNavigate("report")}>
          Report New Issue
        </button>
      </section>
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ReportPage({ onSuccess }) {
  const [form, setForm] = useState({
    category: "",
    district: "",
    town: "",
    description: "",
    severity: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const previewUrl = useMemo(() => (form.image ? URL.createObjectURL(form.image) : ""), [form.image]);
  const selectedCategory = categories.find((category) => category.label === form.category);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.category) nextErrors.category = "Choose a category.";
    if (!form.district) nextErrors.district = "Choose a district.";
    if (!form.town.trim()) nextErrors.town = "Enter the town.";
    if (form.description.trim().length < 20) {
      nextErrors.description = "Add at least 20 characters.";
    }
    if (!form.severity) nextErrors.severity = "Select a severity.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");

    try {
      const image = form.image ? await fileToImagePayload(form.image) : null;
      const response = await fetch(`${apiUrl}/api/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: form.category,
          district: form.district,
          town: form.town,
          description: form.description,
          severity: form.severity,
          image,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.message || "Could not submit the issue.");
      }

      onSuccess(result.issue);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({
      category: "",
      district: "",
      town: "",
      description: "",
      severity: "",
      image: null,
    });
    setErrors({});
  }

  return (
    <section className="page-panel report-page">
      <div className="report-intro">
        <div>
          <Breadcrumb current="Report Issue" />
          <div className="page-title">
            <span className="eyebrow">Public report form</span>
            <h1>Report a local issue in minutes</h1>
            <p>Share the problem, the place, and a photo if you have one. We keep the form short so anyone can report quickly.</p>
          </div>
        </div>
        <ol className="report-steps" aria-label="Report steps">
          <li><span>1</span>Choose issue</li>
          <li><span>2</span>Add location</li>
          <li><span>3</span>Submit report</li>
        </ol>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <FormField as="div" label="What needs fixing?" error={errors.category} required wide>
          <div className="category-picker" role="radiogroup" aria-label="Issue category">
            {categories.map((category) => (
              <button
                aria-checked={form.category === category.label}
                className={`category-choice ${form.category === category.label ? "selected" : ""}`}
                key={category.id}
                role="radio"
                type="button"
                onClick={() => updateField("category", category.label)}
              >
                <span>{category.icon}</span>
                <strong>{category.label}</strong>
                <small>{category.note}</small>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="District" error={errors.district} required>
          <select
            aria-invalid={Boolean(errors.district)}
            value={form.district}
            onChange={(event) => updateField("district", event.target.value)}
          >
            <option value="">Select a district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Town" error={errors.town} required>
          <input
            aria-invalid={Boolean(errors.town)}
            value={form.town}
            onChange={(event) => updateField("town", event.target.value)}
            placeholder="Example: Nugegoda"
          />
        </FormField>

        <FormField
          label="Tell us what happened"
          hint="Include a nearby landmark, how long it has been there, and why it is unsafe."
          error={errors.description}
          required
          wide
        >
          <textarea
            aria-invalid={Boolean(errors.description)}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Example: A large pothole is in front of the bus stop and vehicles swerve around it during busy hours."
          />
          <span className="character-count">{form.description.trim().length}/20 minimum characters</span>
        </FormField>

        <FormField as="div" label="Severity" error={errors.severity} required wide>
          <div className="severity-row">
            {severityOptions.map((severity) => (
              <label className={`severity-option ${form.severity === severity.value ? "selected" : ""}`} key={severity.value}>
                <input
                  type="radio"
                  name="severity"
                  value={severity.value}
                  checked={form.severity === severity.value}
                  onChange={(event) => updateField("severity", event.target.value)}
                />
                <span className={`dot ${severity.value}`} />
                <span>
                  <strong>{severity.label}</strong>
                  <small>{severity.note}</small>
                </span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Add a photo" hint="Optional, but it helps teams understand the issue faster." wide>
          <div className="upload-row">
            <label className="upload-box">
              <input
                accept="image/png,image/jpeg,image/webp"
                type="file"
                onChange={(event) => updateField("image", event.target.files?.[0] || null)}
              />
              <strong>{form.image ? form.image.name : "Choose a photo"}</strong>
              <span>JPG, PNG, or WEBP. Maximum 5MB.</span>
            </label>
            <div className="preview-box">
              {previewUrl ? (
                <img alt="Selected issue preview" src={previewUrl} />
              ) : (
                <span>{selectedCategory ? `${selectedCategory.label} preview` : "Photo preview"}</span>
              )}
            </div>
          </div>
        </FormField>

        <div className="form-actions">
          <button className="secondary-btn" type="button" onClick={resetForm}>
            Reset
          </button>
          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
        {apiError && <div className="form-alert">{apiError}</div>}
      </form>
    </section>
  );
}

function FormField({ as = "label", children, error, hint, label, required = false, wide = false }) {
  const FieldTag = as;
  return (
    <FieldTag className={`form-field ${wide ? "wide" : ""}`}>
      <span>
        {label} {required && <b>*</b>}
      </span>
      {hint && <small>{hint}</small>}
      {children}
      {error && <em>{error}</em>}
    </FieldTag>
  );
}

function SuccessPage({ issue, onNavigate }) {
  const referenceId = issue?.id
    ? `FMA-${String(issue.id).slice(0, 8).toUpperCase()}`
    : "FMA-2026-000124";

  return (
    <section className="success-wrap">
      <div className="success-panel">
        <div className="checkmark">✓</div>
        <h1>Thank you!</h1>
        <p>Your issue has been reported successfully. We will review it and take action soon.</p>
        <span className="reference-label">Reference ID</span>
        <strong className="reference-id">{referenceId}</strong>
        <button className="primary-btn" type="button" onClick={() => onNavigate("issues")}>
          View All Complaints
        </button>
        <button className="link-btn" type="button" onClick={() => onNavigate("report")}>
          Report Another Issue
        </button>
      </div>
    </section>
  );
}

function IssuesPage() {
  const [filters, setFilters] = useState({ search: "", category: "", status: "", severity: "" });
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  React.useEffect(() => {
    let active = true;

    async function loadIssues() {
      setLoading(true);
      setApiError("");
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        if (filters.severity) params.set("severity", filters.severity);

        const response = await fetch(`${apiUrl}/api/issues?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load issues.");
        }

        if (active) setIssues(result.issues.map(mapApiIssue));
      } catch (error) {
        if (active) {
          setApiError(error.message);
          setIssues([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadIssues();

    return () => {
      active = false;
    };
  }, [filters.category, filters.severity]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const text = safeLower(`${safeText(issue.category)} ${safeText(issue.location)} ${safeText(issue.description)}`);
      return (
        text.includes(safeLower(filters.search)) &&
        (!filters.category || issue.category === filters.category) &&
        (!filters.status || issue.status === filters.status) &&
        (!filters.severity || issue.severity === filters.severity)
      );
    });
  }, [filters, issues]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="issues-layout">
      <aside className="filters">
        <div className="filter-heading">
          <h2>Filters</h2>
          <button type="button" onClick={() => setFilters({ search: "", category: "", status: "", severity: "" })}>
            Clear
          </button>
        </div>
        <label>
          Search
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search issues..."
          />
        </label>
        <label>
          Category
          <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="">All Categories</option>
            {[...new Set([...issues.map((issue) => issue.category), ...categories.map((category) => category.label)])].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          Severity
          <select value={filters.severity} onChange={(event) => updateFilter("severity", event.target.value)}>
            <option value="">All Severity</option>
            {severityOptions.map((severity) => (
              <option key={severity.value} value={severity.value}>
                {severity.label}
              </option>
            ))}
          </select>
        </label>
      </aside>
      <section className="issues-main">
        <div className="section-heading with-action">
          <div>
            <h1>All Complaints</h1>
            <p>See reported issues in your community.</p>
          </div>
        </div>
        {apiError && <div className="form-alert">{apiError}</div>}
        {loading ? <div className="empty-state">Loading reports...</div> : <IssueGrid issues={filteredIssues} />}
        <p className="result-count">Showing {filteredIssues.length} of {issues.length} reports</p>
      </section>
    </div>
  );
}

function AdminLoginPage({ onNavigate, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase Auth is not configured in the client environment.");
      return;
    }

    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    onLogin(data.session || null);
    onNavigate("admin");
  }

  return (
    <section className="page-panel admin-login-panel">
      <Breadcrumb current="Admin Login" />
      <div className="page-title">
        <h1>Admin Login</h1>
        <p>Sign in with your Supabase admin account.</p>
      </div>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <FormField label="Email" required>
          <input
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="admin@example.com"
          />
        </FormField>
        <FormField label="Password" required>
          <input
            autoComplete="current-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
          />
        </FormField>
        {error && <div className="form-alert">{error}</div>}
        <button className="primary-btn small" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </section>
  );
}

function AdminPage({ session, onLogout }) {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  React.useEffect(() => {
    let active = true;

    async function loadAdminIssues() {
      if (!session?.access_token) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiUrl}/api/admin/issues`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Could not load admin complaints.");
        if (active) setIssues(Array.isArray(result.issues) ? result.issues : []);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAdminIssues();

    return () => {
      active = false;
    };
  }, [session?.access_token]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const text = safeLower([
        issue?.id,
        issue?.title,
        issue?.category,
        issue?.district,
        issue?.description,
        issue?.status,
      ].map(safeText).join(" "));

      return (
        text.includes(safeLower(filters.search)) &&
        (!filters.status || issue?.status === filters.status)
      );
    });
  }, [filters, issues]);

  async function updateStatus(issueId, status) {
    if (!issueId || !session?.access_token) return;
    setSavingId(issueId);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/admin/issues/${issueId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Could not update status.");
      setIssues((current) =>
        current.map((issue) => (issue.id === issueId ? { ...issue, status: result.issue?.status || status } : issue)),
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSavingId("");
    }
  }

  return (
    <section className="page-panel admin-panel">
      <div className="admin-title-row">
        <div>
          <Breadcrumb current="Admin" />
          <div className="page-title">
            <h1>Complaint Dashboard</h1>
            <p>View and update reports from public.issues.</p>
          </div>
        </div>
        <button className="secondary-btn small admin-link-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Search complaints..."
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
        >
          <option value="">All Status</option>
          {adminStatuses.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="form-alert">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading complaints...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>District</th>
                <th>Description</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td>{safeText(issue.id, "Unknown")}</td>
                  <td>{safeText(issue.title, "Untitled")}</td>
                  <td>{safeText(issue.category, "Other")}</td>
                  <td>{safeText(issue.district, "Unknown")}</td>
                  <td>{safeText(issue.description, "No description provided.")}</td>
                  <td>{formatDate(issue.created_at)}</td>
                  <td>
                    <select
                      value={adminStatuses.includes(issue.status) ? issue.status : "pending"}
                      onChange={(event) => updateStatus(issue.id, event.target.value)}
                      disabled={savingId === issue.id}
                    >
                      {adminStatuses.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!filteredIssues.length && (
                <tr>
                  <td colSpan="7">No complaints match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="result-count">Showing {filteredIssues.length} of {issues.length} complaints</p>
    </section>
  );
}

function IssueGrid({ issues }) {
  if (!issues.length) {
    return <div className="empty-state">No issues match the selected filters.</div>;
  }

  return (
    <div className="issue-grid">
      {issues.map((issue) => (
        <article className="issue-card" key={issue.id}>
          <div className="issue-image">
            <img alt={`${issue.category} report`} src={issue.image || fallbackImage(issue.category)} />
            <span className={`severity-pill ${issue.severity}`}>{toTitle(issue.severity)}</span>
          </div>
          <div className="issue-body">
            <span>Category</span>
            <h3>{issue.category}</h3>
            <p className="location">{issue.location}</p>
            <p>{issue.description}</p>
            <span className={`status-pill ${issue.status}`}>{formatStatus(issue.status)}</span>
            <small>{issue.date} · ID: {issue.id}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function Breadcrumb({ current }) {
  return (
    <div className="breadcrumb">
      <span>Home</span>
      <span>/</span>
      <strong>{current}</strong>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div>
        <Logo onNavigate={onNavigate} />
        <p>Building better communities across Sri Lanka.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <button type="button" onClick={() => onNavigate("home")}>Home</button>
        <button type="button" onClick={() => onNavigate("report")}>Report Issue</button>
      </div>
      <div>
        <h3>Contact</h3>
        <p>support@fixmyarea.lk</p>
        <p>+94 77 123 4567</p>
      </div>
    </footer>
  );
}

function App() {
  const [page, setPage] = useState(getPageFromPath());
  const [submittedIssue, setSubmittedIssue] = useState(null);

  React.useEffect(() => {
    function handlePopState() {
      setPage(getPageFromPath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPage, options = {}) {
    setPage(nextPage === "about" ? "home" : nextPage);
    const path = getPathFromPage(nextPage);
    if (window.location.pathname !== path) {
      if (options.replace) window.history.replaceState({}, "", path);
      else window.history.pushState({}, "", path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      <main>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "report" && <ReportPage onSuccess={(issue) => {
          setSubmittedIssue(issue);
          navigate("success");
        }} />}
        {page === "success" && <SuccessPage issue={submittedIssue} onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function toTitle(value) {
  return safeText(value).replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatus(value) {
  return value === "in_progress" ? "In Progress" : toTitle(value);
}

function fileToImagePayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        data: reader.result,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
}

function mapApiIssue(issue) {
  return {
    id: safeText(issue?.id),
    category: safeText(issue?.category, "Other"),
    location: `${safeText(issue?.town, "Unknown town")}, ${safeText(issue?.district, "Unknown district")}`,
    description: safeText(issue?.description, "No description provided."),
    severity: safeText(issue?.severity, "low"),
    status: safeText(issue?.status, "pending"),
    date: issue.created_at ? new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(issue.created_at)) : "Unknown date",
    image: issue.image_url,
  };
}

function fallbackImage(category) {
  const normalizedCategory = safeLower(category);
  const issue = featuredIssues.find((item) =>
    normalizedCategory.includes(safeLower(item.category).split(" ")[0]),
  );
  return issue?.image || featuredIssues[0].image;
}

function safeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function safeLower(value) {
  return safeText(value).toLowerCase();
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getPageFromPath() {
  if (window.location.pathname === "/report") return "report";
  if (window.location.pathname === "/success") return "success";
  return "home";
}

function getPathFromPage(page) {
  if (page === "report") return "/report";
  if (page === "success") return "/success";
  return "/";
}

createRoot(document.getElementById("root")).render(<App />);
