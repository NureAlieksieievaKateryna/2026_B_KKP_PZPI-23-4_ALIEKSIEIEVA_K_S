import React, { useEffect, useState } from "react";
import keycloak from "./keycloak";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import VacancySearchPage from "./pages/VacancySearchPage";
import SkillsRoadmapPage from "./pages/SkillsRoadmapPage";
import QuestionCardsPage from "./pages/QuestionCardsPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import ResumeReviewPage from "./pages/ResumeReviewPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [page, setPage] = useState("login");
  const [isReady, setIsReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);

        if (auth) {
          localStorage.setItem("token", keycloak.token);
          setPage("dashboard");
        }

        setIsReady(true);
      });
  }, []);

  if (!isReady) return <div>Loading...</div>;

  if (!authenticated && page === "login") {
    return <LoginPage setPage={setPage} />;
  }

  if (!authenticated && page === "register") {
    return <RegisterPage setPage={setPage} />;
  }

  const pages = {
    dashboard: <DashboardPage setPage={setPage} />,
    vacancies: <VacancySearchPage />,
    skills: <SkillsRoadmapPage />,
    questions: <QuestionCardsPage />,
    profile: <ProfilePage />,
    mock: <MockInterviewPage />,
    resume: <ResumeReviewPage />,
    progress: <ProgressPage />,
  };

  return (
    <Layout page={page} setPage={setPage}>
      {pages[page] || <DashboardPage setPage={setPage} />}
    </Layout>
  );
}