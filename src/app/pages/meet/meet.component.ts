import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: `./meet.component.html`,
  styleUrls: ['./meet.component.css']
})
export class MeetComponent {
  currentImg = 'assets/images/CGCA-LOGO.png';
  currentName = 'Board Member';
  currentTitle = 'Title';
  currentContent1 = 'Click a card to see more information.';
  currentContent2 = '';
  currentContent3 = '';
  currentContent4 = '';

  cards = [
    { image: 'assets/images/TamaraHeadshot.png', 
    name: 'Tamara Tsaava',
    title: 'President', 
    content1: 'Tamara was born and raised in Tbilisi, Republic of Georgia and moved to the United States in 1992. First she lived in Atlanta, GA. and in 1998 Tamara and her family moved to Denver, CO and never left from here. She fell in love with Colorado weather, history, people and after 26 years of living in Denver, this is her home.',
    content2: 'Tamara has over 30 years of experience in financial investments, wealth management, legal and real estate industries. With experience as a Merrill Lynch Global Wealth and Investment Management financial advisor, Tamara found a company Tsaava Asset Strategies Consultants specializing in marriage/divorce financial analysis and planning. She partners with Usaj Realty Co. and helps her clients buy, sell and invest in real estate.',
    content3: '"It is so exciting to find so many Georgians coming to Colorado and making it their home. For a long time I wanted to find ways to promote Georgian culture and history in Colorado and United States of America. At last found the way to do that through Colorado Georgian Community Association - Ertoba. It`s about time!" - Tamara',
    content4: '',
    class: 'Tamara-expanded' },

    { image: 'assets/images/RuslanHeadshot.jpg',
    name: 'Ruslan Huhua',
    title: 'Vice President',
    content1: 'Born and raised in the city of Sochi, Ruslan always had a passion for learning and exloring culture. After completing his early education in Sochi, he went on to pursue his studies in theology at the Tbilisi Theological Seminary and the Gelati Theological Academy and Seminary in Kutaisi, Georgia.',
    content2: 'In 2001, Ruslan made a life-changing decision to move to the United States with his wife and two sons.',
    content3: 'Ruslan is a respected member of the local community and is dedicated to making a positive impact in the world. He currently works as a contractor helping people renovate and build their properties, and with his wealth of knowledge and experience has become a trusted expert in his field, always looking for ways to provide exceptional service to his clients.',
    content4: 'After his third son was born in the U.S.A., he started to see how important it was to preserve Georgian culture and traditions over generations. This led him to join forces with fellow Georgians to start the Colorado Georgian Community Association.',
    class: 'Ruslan-expanded' },

    { image: 'assets/images/TeaHeadshot.jpg',
    name: 'Tea Todua',
    title: 'Board Director',
    content1: 'Tea Todua was born and raised in the beautiful country of Georgia, next to the Black Sea in the small town of Zugdidi. She graduated from David Tvildiani Medical University DTMU (formerly AI ETI Medical School) with a MD degree. DTMU was the first school of medicine in Georgia to implement the American model of medical education, an English language curriculum in the Caucasus region at that time.',
    content2: 'Tea is committed to building a career in medicine, serving the humanity. She worked as an IR (interventional radiologist) in the department of vascular surgery and mentored students at different medical schools in Georgia. With her colleagues from Tbilisi State Medical University (TSMU) and in partnership with Emory University School of Medicine (EUSM), Tea contributed to establishing a very successful program in healthcare education. the American MD program, now a trusted leader in preparing future health learners and leaders in the country of Georgia.',
    content3: 'In 2015 Tea met the love of her life, and moved to Colorado. She decided to dedicate her life to family and raising three daughters with her husband, Don Pittser.',
    content4: '"I have always been impassioned to promote my country. In that spirit, I am very excited to join forces with my fellow members in developing cultural and educational projects and hosting events in our community of Colorado." - Tea.',
    class: 'Tea-expanded' },

    { image: 'assets/images/AlexanderHeadshot.jpg',
    name: 'Alexander Narsia',
    title: 'Treasurer',
    content1: 'Alexander Narsia was born on a train in Sukhumi and raised in Tbilisi, Georgia. Thereafter he immigrated with his family to Israel at the age of 9 and to the United States of America at the age of 13. Alexander competed professionally in the sport of tennis and has transitioned into his professional career as an engineer in the oil and gas sector. He is currently a Senior Project Manager at Meritage Midstream. He is a father of two daughters, Sophia and Leila and a son, Revaz and he spends most of his time away from work bonding with them.',
    content2: 'Alexander believes that being of Georgian decent is not a nationality, but a way of life and is excited to help unite the Georgian community in the State of Colorado.',
    content3: '',
    content4: '',
    class: 'Alexander-expanded' },

    { image: 'assets/images/DonaldHeadshot.jpg',
    name: 'Donald Pittser',
    title: 'Secretary',
    content1: 'My first visit to Tbilisi, Georgia was in 2008 to visit a possible business opportunity. This resulted in me living in Tbilisi for five months in 2010. Falling in love with Georgia, like many who have been fortunate enough to visit, I returned to Georgia each year before meeting my lovely wife, Tea Todua. Now we have three little Georgian/American daughters. I am excited to help the Colorado Georgian Community Association become a reality.',
    content2: '',
    content3: '',
    content4: '',
    class: 'Donald-expanded' },
  ];

  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }
}
