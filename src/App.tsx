import {Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "@/pages/dashboard.tsx";
import {Home, Users, Trophy, Medal, CreditCard, FileSpreadsheet} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import AthletesList from "@/pages/athletes/list.tsx";
import AthletesCreate from "@/pages/athletes/create.tsx";
import AthletesEdit from "@/pages/athletes/edit.tsx";
import AthletesShow from "@/pages/athletes/show.tsx";
import UpComingMeetsList from "@/pages/competitions/list.tsx";
import AthleteCompetitionsList from "@/pages/athletecompetitions/list.tsx";
import AthleteCompetitionsCreate from "@/pages/athletecompetitions/create.tsx";
import AthleteCompetitionsEdit from "@/pages/athletecompetitions/edit.tsx";
import PaymentsCreate from "@/pages/payments/create.tsx";
import PaymentsList from "@/pages/payments/list.tsx";
import PaymentsEdit from "@/pages/payments/edit.tsx";
import TrainingBlockList from "@/pages/trainingblocks/list.tsx";
import TrainingBlockCreate from "@/pages/trainingblocks/create.tsx";
import TrainingBlockEdit from "@/pages/trainingblocks/edit.tsx";






function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "8IYsUd-6jrhbv-paMMVA",
                  title: {
                      text: "Collar PL",
                      icon: <Trophy className="h-5 w-5" />,
                  },
              }}
              resources={[
              {
                  name: 'dashboard',
                  list: '/',
                  meta: {label: 'Home', icon: <Home />}
              },
                  {
                      name: 'athletes',
                      list: '/athletes',
                      create: '/athletes/create',
                      edit: '/athletes/:id/edit',
                      show: '/athletes/show/:id',
                      meta: {
                          label: 'Athletes',
                          icon: <Users />
                      }
                  },
                  {
                      name: 'athleteCompetitions',
                      list: '/athlete-competitions',
                      create: '/athlete-competitions/create',
                      edit: '/athlete-competitions/:id/edit',
                      show: '/athlete-competitions/show/:id',
                      meta: {
                          label: 'My Athlete Competitions',
                          icon: <Medal/>
                      }
                  },

                  {
                      name: 'competitions',
                      list: '/competitions',
                      show: '/competitions/show/:id',
                      meta: {
                          label: 'All Competitions',
                          icon: <Trophy/>
                      }
                  },
                  {
                      name: 'payments',
                      list: '/payments',
                      create: '/payments/create',
                      edit: '/payments/:id/edit',
                      show: '/payments/show/:id',
                      meta: {
                          label: 'Athlete Payments',
                          icon: <CreditCard/>
                      }
                  },
                  {
                      name: 'trainingBlock',
                      list: '/training-blocks',
                      create: '/training-blocks/create',
                      edit: '/training-blocks/:id/edit',
                      show: '/training-blocks/show/:id',
                      meta: {
                          label: 'Training Blocks',
                          icon: <FileSpreadsheet/>
                      }
                  }
              ]}
            >
              <Routes>
                <Route element={
                    <Layout>
                        <Outlet />
                    </Layout>
                }>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="athletes">
                        <Route index element={<AthletesList />} />
                        <Route path="create" element={<AthletesCreate />} />
                        <Route path=":id/edit" element={<AthletesEdit />} />
                        <Route path="show/:id" element={<AthletesShow />} />
                    </Route>
                    <Route path="athlete-competitions">
                        <Route index element={<AthleteCompetitionsList />} />
                        <Route path="create" element={<AthleteCompetitionsCreate />} />
                        <Route path=":id/edit" element={<AthleteCompetitionsEdit />} />
                    </Route>
                    <Route path="competitions">
                        <Route index element={<UpComingMeetsList />} />
                    </Route>
                    <Route path="payments">
                        <Route index element={<PaymentsList />} />
                        <Route path="create" element={<PaymentsCreate />} />
                        <Route path=":id/edit" element={<PaymentsEdit />} />
                    </Route>
                    <Route path="training-blocks">
                        <Route index element={<TrainingBlockList />} />
                        <Route path="create" element={<TrainingBlockCreate />} />
                        <Route path=":id/edit" element={<TrainingBlockEdit />} />
                    </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
