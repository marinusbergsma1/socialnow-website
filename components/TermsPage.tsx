import React from "react";
import LegalPage from "./LegalPage";
import { terms } from "./legal";

const TermsPage: React.FC = () => <LegalPage doc={terms} path="/voorwaarden" />;
export default TermsPage;
