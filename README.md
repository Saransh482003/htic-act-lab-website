# Advanced Cardiovascular Technology Laboratory (ACT Lab) Website

<div align="center">
  <img src="https://raw.githubusercontent.com/Saransh482003/htic-act-lab-website/master/public/actlabs_logo_home.png" alt="ACT Lab Logo" width="150" />
  <h3>Pioneering Innovation in Cardiovascular Technology</h3>
</div>

## 🔬 About ACT Lab

The **Advanced Cardiovascular Technology Laboratory (ACT Lab)** is a state-of-the-art research facility at IIT Madras dedicated to pioneering cardiovascular healthcare through innovative technology and scientific research. Our interdisciplinary team works at the intersection of biomedical engineering, artificial intelligence, and clinical medicine to develop novel solutions for cardiovascular health challenges.

Our mission is to improve patient outcomes and advance medical device innovation through rigorous research, clinical validation, and industry partnerships.

## 📱 Website Overview

This website serves as a comprehensive digital platform for ACT Lab, showcasing our:

- Research projects and publications
- Clinical studies and scientific research
- Team members and expertise
- Facilities and capabilities
- News, events, and career opportunities

The website is built using **Next.js** with a clean, modern design that emphasizes accessibility and user experience.

<div align="center">
  <img src="https://raw.githubusercontent.com/Saransh482003/htic-act-lab-website/master/public/home/banner.jpg" alt="ACT Lab Website Banner" width="700" />
</div>

## 🛠️ Technical Architecture

### Data Management with JSON Files

The website uses a **JSON-based data architecture** that makes content management simple and accessible even for non-technical team members:

```
JSONs/
  ├── contact/
  │   └── meetTheTeam.json       # Team member information
  ├── home/
  │   ├── about_and_stats.json   # Homepage about section and statistics
  │   ├── about_statistics.json  # Detailed statistics for visualization
  │   ├── news.json              # Latest news and events
  │   └── our_work.json          # Featured work highlights
  ├── projects/
  │   └── projects.json          # Project details and metadata
  └── publications/
      ├── paperDetails.json      # Publication metadata
      ├── embeddings.json        # Semantic search embeddings
      ├── scholarLinks.json      # Links to publication platforms
      └── groundAuthors.json     # Author reference data
```

### API Structure

The website features several custom APIs that handle data fetching, processing, and special features:

#### 📊 Publication APIs

| API Endpoint | Description | Usage |
|--------------|-------------|-------|
| `/api/publications/paperDetails` | Fetches detailed publication metadata | `GET /api/publications/paperDetails` |
| `/api/publications/paperDetails?action=similar` | Performs semantic search on publications | `POST` with `{ query: "search term" }` |
| `/api/publications/filterLimiter` | Returns top authors, publishers, years | `GET /api/publications/filterLimiter?authors=15&publishers=5&years=5` |

#### 👥 Team Information APIs

| API Endpoint | Description | Usage |
|--------------|-------------|-------|
| `/api/contact/meetTheTeam` | Retrieves team member information | `GET /api/contact/meetTheTeam` |

#### 🏠 Homepage Content APIs

| API Endpoint | Description | Usage |
|--------------|-------------|-------|
| `/api/home/about_and_stats` | Fetches homepage about content | `GET /api/home/about_and_stats` |
| `/api/home/about_statistics` | Retrieves statistical data | `GET /api/home/about_statistics` |
| `/api/home/news` | Gets latest news items | `GET /api/home/news` |
| `/api/home/our_work` | Fetches work highlights | `GET /api/home/our_work` |

#### 🧪 Projects API

| API Endpoint | Description | Usage |
|--------------|-------------|-------|
| `/api/projects/getProjects` | Retrieves project information | `GET /api/projects/getProjects` |

## 🔍 Semantic Search Implementation

The publications page features an advanced **AI-powered semantic search** capability that helps users find relevant research based on concepts, not just keywords:

1. **Embeddings**: Publications are converted to vector embeddings using AI models
2. **Similarity Search**: User queries are vectorized and compared against publication embeddings
3. **Ranked Results**: Publications are returned sorted by semantic similarity

```javascript
// Example usage of semantic search API
const response = await fetch('/api/publications/paperDetails?action=similar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: "arterial stiffness monitoring" })
});
const results = await response.json();
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saransh482003/htic-act-lab-website.git
   cd htic-act-lab-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the website.

## 📝 Content Management Guide

### Updating Website Content

1. **Edit JSON Files**: Most content can be updated by modifying the appropriate JSON files in the `JSONs/` directory.

2. **Publication Data**: To update publications, modify `JSONs/publications/paperDetails.json`.

3. **Team Information**: To update team members, edit `JSONs/contact/meetTheTeam.json`.

4. **News and Events**: Update `JSONs/home/news.json` to change news items.

5. **Projects**: Modify `JSONs/projects/projects.json` to update project information.

### Adding New Features

For developers extending the website:

1. **Page Components**: Pages are located in the `pages/` directory.

2. **API Routes**: API implementations are in the `pages/api/` directory.

3. **Styling**: CSS modules are in the `styles/` directory with corresponding component names.

4. **Global Components**: Reusable components are in the `components/` directory.

## 👨‍💻 Creator

This website was developed by:

**Name**: Saransh Saini  
**Role**: Full-stack & AI/ML Developer  
**GitHub**: [Saransh482003](https://github.com/Saransh482003)  
**Contact**: [https://www.thesaranshsaini.com/](https://www.thesaranshsaini.com/) 

## 📄 License

[Add license information here]
