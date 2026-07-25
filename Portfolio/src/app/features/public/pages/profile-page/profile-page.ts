import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SkillGroup {
  title: string;
  description: string;
  skills: string[];
}

interface DevelopmentValue {
  title: string;
  description: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {

  readonly developmentValues: DevelopmentValue[] = [
    {
      title: '前後端整合',
      description:
        '從畫面、API、商業邏輯到資料庫，理解功能在完整系統中的資料流向與責任分工。',
    },
    {
      title: '可維護性',
      description:
        '重視程式結構、資料驗證與錯誤處理，讓後續修改或新增功能時更容易理解與擴充。',
    },
    {
      title: '問題拆解',
      description:
        '將複雜需求拆分成可以逐步完成與測試的小階段，降低開發與除錯時的複雜度。',
    },
    {
      title: '持續學習',
      description:
        '透過不同框架與領域的實作，整理共通概念，而不只是累積工具與套件的數量。',
    },
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      title: '前端開發',
      description: '建立響應式介面、表單、狀態管理、圖形呈現與 API 串接。',
      skills: [
        'HTML',
        'CSS',
        'Tailwind CSS',
        'Bootstrap',
        'JavaScript',
        'TypeScript',
        'Angular',
        'React',
        'Vue',
        'Canvas',
      ],
    },
    {
      title: '後端開發',
      description: '建立 REST API、身分驗證、資料處理與後端商業邏輯。',
      skills: [
        'ASP.NET Core',
        'Express',
        'Django',
        'FastAPI',
        'Flask',
        // 'Spring Boot',
      ],
    },
    {
      title: '資料庫與資料處理',
      description: '設計資料模型、關聯與查詢，處理系統中的資料保存與交換。',
      skills: [
        'SQL Server',
        'MySQL',
        'PostgreSQL',
        'SQLite',
        'Entity Framework Core',
      ],
    },
    {
      title: '資料分析與視覺化',
      description: '整理、分析與呈現資料，建立圖表與視覺化資訊。',
      skills: [
        'NumPy',
        'Pandas',
        'Matplotlib',
        'ECharts',
      ],
    },
    {
      title: 'AI、電腦視覺與向量應用',
      description: '整合 AI 模型、電腦視覺、向量搜尋與資料檢索功能。',
      skills: [
        'OpenCV',
        'AI',
        'LangChain',
        'RAG',
        'Chroma',
        'FAISS',
      ],
    },
    {
      title: 'IoT、即時通訊與硬體整合',
      description: '整合感測裝置、通訊協定、即時影音與機器人相關應用。',
      skills: [
        'MQTT',
        'WebRTC',
        'Raspberry Pi',
        'Arduino Nano',
        'ROS',
      ],
    },
    {
      title: '開發工具與雲端部署',
      description: '使用版本控制、容器化與雲端平台進行協作、部署與系統維護。',
      skills: [
        'Git',
        'GitHub',
        'GitLab',
        'Docker',
        'AWS',
        'Azure',
        'Zeabur',
      ],
    },
    {
      title: '視覺設計與影音製作',
      description: '影像處理、平面與向量設計、攝影後製、影音剪輯、錄製與 3D 製作。',
      skills: [
        'Photoshop',
        'Illustrator',
        'Lightroom',
        'OBS Studio',
        'Shotcut',
        'Blender',
      ],
    },
  ];

}
