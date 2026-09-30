import {
  FAQItem,
  FacilityItem,
  ServiceItem,
  Testimonial,
  Trainer,
} from '../types';

export const BUSINESS_INFO = {
  name: 'IronFit Fitness Studio',
  shortName: 'IRONFIT',
  type: 'Premium Gym & Fitness Centre',
  location: 'HSR Layout, Bengaluru, Karnataka',
  address: '#142, 27th Main Road, Sector 2, HSR Layout, Bengaluru, Karnataka 560102',
  phone: '+91 90000 12345',
  phoneClean: '+919000012345',
  whatsapp: '+91 90000 12345',
  whatsappLink: 'https://wa.me/919000012345?text=Hi%20IronFit%2C%20I%20would%20like%20to%20know%20more%20about%20the%2030-Day%20Fitness%20Challenge',
  email: 'hello@ironfitfitness.example',
  owner: {
    name: 'Kiran Mehta',
    email: 'owner@ironfitfitness.example',
    phone: '+91 90000 67890',
  },
  openingHours: {
    weekday: 'Monday – Saturday: 5:30 AM – 10:00 PM',
    sunday: 'Sunday: 6:00 AM – 1:00 PM',
  },
  campaign: {
    title: '30-Day Fitness Challenge',
    offer: '30-Day Fitness Challenge + Free Trial Session',
    primaryCta: 'Join the 30-Day Challenge',
    secondaryCta: 'Book a Free Trial',
  },
  socialProof: {
    rating: '4.8 / 5',
    platform: 'Google Rating',
    reviewCount: '320+ Reviews',
  },
};

export const CHALLENGE_OFFERS = [
  {
    title: 'Structured Workouts',
    description:
      'Follow a more structured approach to your workouts instead of trying to figure everything out on your own.',
    iconName: 'Dumbbell',
  },
  {
    title: 'Professional Guidance',
    description:
      'Get guidance from experienced fitness coaches based on your fitness goals.',
    iconName: 'Compass',
  },
  {
    title: 'A Consistent Routine',
    description:
      'Build a more consistent approach to your workouts and make fitness part of your routine.',
    iconName: 'CalendarCheck',
  },
  {
    title: 'A Fitness Environment Built for Different Goals',
    description:
      'From strength training and muscle building to weight management and general fitness, IronFit supports a range of fitness goals.',
    iconName: 'Target',
  },
];

export const WHO_IS_IT_FOR = [
  'Want to lose weight or reduce body fat',
  'Want to build muscle',
  'Want to improve strength',
  'Want to improve overall fitness',
  'Want help building a consistent workout routine',
  'Are looking for a convenient local gym',
  'Are beginners looking for professional guidance',
];

export const HOW_TO_GET_STARTED = [
  {
    step: '01',
    title: 'Submit Your Details',
    description: 'Tell us a little about yourself and your fitness goal.',
  },
  {
    step: '02',
    title: 'Connect With the IronFit Team',
    description: 'The team will contact you to help you get started.',
  },
  {
    step: '03',
    title: 'Begin Your Fitness Journey',
    description: 'Take the next step with IronFit Fitness Studio.',
  },
];

export const BENEFITS: ServiceItem[] = [
  {
    title: 'Structured Workouts',
    description:
      'Workouts designed around a more structured approach so you can build consistency into your fitness routine.',
  },
  {
    title: 'Expert Guidance',
    description:
      'Get one-on-one guidance from certified trainers based on your individual fitness goals.',
  },
  {
    title: 'Build Consistency',
    description:
      'A structured fitness environment can help you establish a regular workout routine and stay committed to it.',
  },
  {
    title: 'Improve Strength & Fitness',
    description:
      'Work on strength, muscle building, and overall fitness with training options designed for different goals.',
  },
  {
    title: 'Support Your Weight-Management Goals',
    description:
      'IronFit offers structured training and fitness guidance for members focused on weight management and improving overall fitness.',
  },
];

export const PROGRAMS: ServiceItem[] = [
  {
    title: 'Gym Membership',
    description:
      'Train with the equipment and workout facilities you need to work towards your fitness goals.',
  },
  {
    title: 'Personal Training',
    description:
      'Get one-on-one guidance from certified trainers based on your individual fitness goals.',
  },
  {
    title: 'Weight Loss Program',
    description:
      'Structured training and fitness guidance for members focused on reducing body fat and improving overall fitness.',
  },
  {
    title: 'Strength & Muscle Building',
    description:
      'Strength-focused workouts for members looking to build muscle and improve performance.',
  },
  {
    title: 'Group Fitness',
    description:
      'Instructor-led group sessions designed to make workouts more engaging and consistent.',
  },
];

export const WHY_CHOOSE_IRONFIT = [
  {
    title: 'Experienced Trainers',
    description:
      'Work with fitness coaches who bring experience across strength training, muscle building, weight management, beginner fitness, weight loss, and functional training.',
  },
  {
    title: 'Modern Equipment',
    description:
      'Train with modern strength-training and cardio equipment, along with dedicated areas for free weights and functional training.',
  },
  {
    title: 'Structured Programs',
    description:
      'Choose from gym membership, personal training, weight loss, strength and muscle-building, and group fitness options.',
  },
  {
    title: 'Beginner-Friendly Guidance',
    description:
      'If you’re new to fitness, you can get professional guidance and a structured approach to developing your workout routine.',
  },
  {
    title: 'Convenient Local Location',
    description: `IronFit is located at: #142, 27th Main Road, Sector 2, HSR Layout, Bengaluru, Karnataka 560102.`,
  },
];

export const TRAINERS: Trainer[] = [
  {
    name: 'Arjun Rao',
    role: 'Head Fitness Coach',
    experience: '7+ years of experience in strength training and fitness coaching.',
    specializations: ['Strength Training', 'Muscle Building', 'Weight Management'],
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Priya Nair',
    role: 'Fitness Coach',
    experience: '5+ years of experience helping beginners develop sustainable workout routines.',
    specializations: ['Beginner Fitness', 'Weight Loss', 'Functional Training'],
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    author: 'Rahul M.',
    quote:
      'Joining IronFit completely changed my approach to fitness. The trainers helped me build a proper routine and stay consistent.',
  },
  {
    author: 'Sneha K.',
    quote:
      'I was a complete beginner when I joined. The trainers made the process comfortable and easy to follow.',
  },
  {
    author: 'Vikram S.',
    quote:
      'Great equipment, helpful trainers and a really motivating environment.',
  },
];

export const FACILITIES: FacilityItem[] = [
  { name: 'Strength Training Equipment', iconName: 'Dumbbell' },
  { name: 'Cardio Equipment', iconName: 'Activity' },
  { name: 'Free-Weight Area', iconName: 'Weight' },
  { name: 'Functional Training Area', iconName: 'Flame' },
  { name: 'Group Workout Space', iconName: 'Users' },
  { name: 'Changing Rooms', iconName: 'DoorClosed' },
  { name: 'Lockers', iconName: 'Lock' },
  { name: 'Drinking Water', iconName: 'Droplets' },
  { name: 'Air-Conditioned Workout Area', iconName: 'Wind' },
  { name: 'Parking Availability', iconName: 'Car' },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is the 30-Day Fitness Challenge suitable for beginners?',
    answer:
      'Yes. IronFit provides structured fitness programs and professional guidance for beginners as well as experienced members. Priya Nair specifically works with beginners to help them develop sustainable workout routines.',
  },
  {
    id: 'faq-2',
    question: 'What is the 30-Day Fitness Challenge?',
    answer:
      'The 30-Day Fitness Challenge is IronFit’s lead-generation campaign designed to help people take the next step toward their fitness goals through a structured fitness environment and professional guidance. The campaign includes a: 30-Day Fitness Challenge + Free Trial Session.',
  },
  {
    id: 'faq-3',
    question: 'What can I work towards at IronFit?',
    answer:
      'IronFit supports different fitness goals, including weight loss, fat loss, muscle gain, strength training, general fitness, and building a consistent workout routine.',
  },
  {
    id: 'faq-4',
    question: 'What training options are available?',
    answer:
      'IronFit offers gym membership, personal training, a weight loss program, strength and muscle-building training, and group fitness.',
  },
  {
    id: 'faq-5',
    question: 'Who are the trainers?',
    answer:
      'IronFit’s trainers include Arjun Rao, Head Fitness Coach with 7+ years of experience in strength training and fitness coaching, and Priya Nair, Fitness Coach with 5+ years of experience helping beginners develop sustainable workout routines.',
  },
  {
    id: 'faq-6',
    question: 'What are the gym timings?',
    answer:
      'Monday – Saturday: 5:30 AM – 10:00 PM\nSunday: 6:00 AM – 1:00 PM',
  },
  {
    id: 'faq-7',
    question: 'Where is IronFit located?',
    answer:
      'IronFit Fitness Studio is located at: #142, 27th Main Road, Sector 2, HSR Layout, Bengaluru, Karnataka 560102.',
  },
  {
    id: 'faq-8',
    question: 'How do I book my free trial?',
    answer:
      'Submit your details through the enquiry form and select your preferred workout time. The IronFit team will contact you to help you get started.',
  },
  {
    id: 'faq-9',
    question: 'What happens after I submit the form?',
    answer:
      'Your details are submitted to the IronFit team for follow-up. The team will review your enquiry and contact you regarding the next steps.',
  },
  {
    id: 'faq-10',
    question: 'How can I contact IronFit directly?',
    answer:
      'You can contact IronFit by phone or WhatsApp at: +91 90000 12345.',
  },
];
