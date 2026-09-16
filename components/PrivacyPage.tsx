import React from "react";
import LegalPage from "./LegalPage";
import { privacy } from "./legal";

const PrivacyPage: React.FC = () => <LegalPage doc={privacy} path="/privacy" />;
export default PrivacyPage;
