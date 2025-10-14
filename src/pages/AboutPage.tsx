import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import { FileSignature } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigationContext } from '../contexts/NavigationContext.tsx';

const translations = {
  en: {
    title: "You've spoken and I've listened...",
    subtitle: "People keep telling me they're tired of politicians wasting their money. Well... fair enough.",
    missionTitle: "Our Mission",
    missionBody1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    missionBody2: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    issuesTitle: "Key Issues",
    envTitle: "Environmental Concerns",
    envBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    communityTitle: "Community Impact",
    communityBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    econTitle: "Economic Considerations",
    econBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    policyTitle: "Policy Reform",
    policyBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timelineTitle: "Timeline & Next Steps",
    phase1Title: "Phase 1: Community Engagement",
    phase1Body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    phase2Title: "Phase 2: Political Action",
    phase2Body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    phase3Title: "Phase 3: Implementation",
    phase3Body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    involvedTitle: "Get Involved",
    involvedBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ctaButton: "Sign the Petition",
  },
  cy: {
    title: "Ynghylch y Boicot",
    subtitle: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    missionTitle: "Ein Cenhadaeth",
    missionBody1: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    missionBody2: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    issuesTitle: "Materion Allweddol",
    envTitle: "Pryderon Amgylcheddol",
    envBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    communityTitle: "Effaith Gymunedol",
    communityBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    econTitle: "Ystyriaethau Economaidd",
    econBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    policyTitle: "Diwygio Polisi",
    policyBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timelineTitle: "Llinell Amser a'r Camau Nesaf",
    phase1Title: "Cam 1: Ymgysylltu â'r Gymuned",
    phase1Body: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    phase2Title: "Cam 2: Gweithredu Gwleidyddol",
    phase2Body: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    phase3Title: "Cam 3: Gweithredu",
    phase3Body: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    involvedTitle: "Cymerwch Ran",
    involvedBody: "Llorwm ipswm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ctaButton: "Llofnodwch y Ddeiseb",
  }
};

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const { setIsNavigating } = useNavigationContext();
  const t = translations[language];

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="fade">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-brand-blue"
            >
              {t.title}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              People keep telling me they're tired of politicians wasting their money. <em>Well... fair enough.</em>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            <ScrollReveal direction="up">
              <div>
                <h2 
                  className="text-3xl font-bold mb-6 text-brand-blue"
                >
                  {t.missionTitle}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {t.missionBody1}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t.missionBody2}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div 
                className="p-8 rounded-2xl bg-white"
              >
                <h2 
                  className="text-3xl font-bold mb-6 text-brand-blue"
                >
                  {t.issuesTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-brand-blue">
                      {t.envTitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.envBody}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-brand-blue">
                      {t.communityTitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.communityBody}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-brand-blue">
                      {t.econTitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.econBody}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-brand-blue">
                      {t.policyTitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.policyBody}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div>
                <h2 
                  className="text-3xl font-bold mb-6 text-brand-blue"
                >
                  {t.timelineTitle}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div 
                      className="w-4 h-4 rounded-full mt-2 mr-4 flex-shrink-0 bg-brand-blue"
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-brand-blue">
                        {t.phase1Title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t.phase1Body}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div 
                      className="w-4 h-4 rounded-full mt-2 mr-4 flex-shrink-0 bg-brand-blue"
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-brand-blue">
                        {t.phase2Title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t.phase2Body}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div 
                      className="w-4 h-4 rounded-full mt-2 mr-4 flex-shrink-0 bg-brand-blue"
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-brand-blue">
                        {t.phase3Title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t.phase3Body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="text-center py-12">
                <h2 
                  className="text-3xl font-bold mb-6 text-brand-blue"
                >
                  {t.involvedTitle}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {t.involvedBody}
                </p>
                <div className="mt-8">
                  <Link
                    to="/sign"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-brand-blue"
                    onClick={() => setIsNavigating(true)}
                  >
                    <FileSignature className="mr-3" size={24} />
                    {t.ctaButton}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;