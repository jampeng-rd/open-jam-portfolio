import { Technology } from "../../technology/models/technology.model";

export interface AddPortFolioRequest {
    name: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    gitHubUrl: string;
    gitLabUrl: string;
    demoUrl: string;
    videoUrl: string;
    pdfUrl: string;
    isVisible: boolean;
    technologies: string[];
}

export interface PortFolio {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    gitHubUrl: string;
    gitLabUrl: string;
    demoUrl: string;
    videoUrl: string;
    pdfUrl: string;
    isVisible: boolean;
    technologies: Technology[];
}

export interface UpdatePortFolioRequest { 
    name: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    gitHubUrl: string;
    gitLabUrl: string;
    demoUrl: string;
    videoUrl: string;
    pdfUrl: string;
    isVisible: boolean;
    technologies: string[];
}