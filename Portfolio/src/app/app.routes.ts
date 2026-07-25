import { Routes } from '@angular/router';
import { TechnologyList } from './features/technology/technology-list/technology-list';
import { AddTechnology } from './features/technology/add-technology/add-technology';
import { EditTechnology } from './features/technology/edit-technology/edit-technology';
import { PortfolioList } from './features/Portfolio/portfolio-list/portfolio-list';
import { AddPortfolio } from './features/Portfolio/add-portfolio/add-portfolio';
import { EditPortfolio } from './features/Portfolio/edit-portfolio/edit-portfolio';
import { HomePage } from './features/public/pages/home-page/home-page';
import { PortfolioDetailPage } from './features/public/pages/portfolio-detail-page/portfolio-detail-page';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Forbidden } from './core/components/forbidden/forbidden';
import { NotFound } from './core/components/not-found/not-found';
import { ProfilePage } from './features/public/pages/profile-page/profile-page';
import { PortfoliosPage } from './features/public/pages/portfolios-page/portfolios-page';

export const routes: Routes = [
    {
        path:'',
        component: HomePage,
    },
    {
        path:'portfolio/:url',
        component: PortfolioDetailPage,
    },
    {
        path: 'log_in',
        component: Login,
        canActivate: [guestGuard],
    },
    {
        path: 'about-me',
        component: ProfilePage,
    },
    {
        path: 'portfolio-projects',
        component: PortfoliosPage,
    },
    {
        path: 'forbidden',
        component: Forbidden,
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        children: [
            {
                path: 'technologys',
                component: TechnologyList,
            },
            {
                path: 'technologys/add',
                component: AddTechnology,
            },
            {
                path: 'technologys/edit/:id',
                component: EditTechnology,
            },
            {
                path: 'portfolios',
                component: PortfolioList,
            },
            {
                path: 'portfolios/add',
                component: AddPortfolio,
            },
            {
                path: 'portfolios/edit/:id',
                component: EditPortfolio,
            },
        ],
    },
    {
        path: '**',
        component: NotFound,
    },
];
