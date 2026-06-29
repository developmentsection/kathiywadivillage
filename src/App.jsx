import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Globe2,
  Heart,
  Landmark,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Quote,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import './App.css'
import {
  fetchOwnerLeads,
  getLocalLeads,
  getOwnerSession,
  isCloudConfigured,
  ownerSignIn,
  ownerSignOut,
  persistLead,
  updateOwnerLeadStatus,
} from './leadService'

const WA = '919998321265'
const phone = '+91 99983 21265'
const email = 'info@kathiyawadivillage.com'
const hours = '11:00 AM - 3:00 PM & 7:00 PM - 11:00 PM'
const weekendNote = 'Saturday, Sunday and festive-season tables fill quickly. Please book in advance and visit only after branch confirmation.'
const usaLocationPath = '/locations/new-jersey-usa'
const customerCount = '10 Lac+'
const customerServedLabel = 'Customer Served'
const bookingSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
]

const branches = [
  {
    slug: 'sama',
    name: 'Sama',
    capacity: '130+',
    address: 'Sama-Savli Rd, Vemali, Vadodara, Gujarat 390024',
    tag: 'Family flagship',
    wa: '919081219990',
    mapQuery: 'Sama-Savli Rd, Vemali, Vadodara, Gujarat 390024',
    reviewQuery: 'Kathiyawadi Village, Sama-Savli Rd, Vemali, Vadodara, Gujarat 390024',
  },
  {
    slug: 'bhayli',
    name: 'Bhayli (Vasna)',
    capacity: '120+',
    address: 'Vasant Vihar FF 105, Nilamber Bellisimmo 3, Bhayli, Vadodara, Gujarat 391410',
    tag: 'Celebration favourite',
    wa: '919173361977',
    mapQuery: 'Vasant Vihar FF 105, Nilamber Bellisimmo 3, Bhayli, Vadodara, Gujarat 391410',
    reviewQuery: 'Kathiyawadi Village, Vasant Vihar FF 105, Nilamber Bellisimmo 3, Bhayli, Vadodara, Gujarat 391410',
  },
  {
    slug: 'manjalpur',
    name: 'Manjalpur',
    capacity: '100+',
    address: 'Shop No. FF 102/103, La Majesty Complex, near Anugrha Hospital, Near Tulsidham Char Rasta, Krupal Society, Manjalpur, Vadodara, Gujarat 390009',
    tag: 'Neighbourhood dining',
    wa: '919173350151',
    mapQuery: 'Shop No. FF 102/103, La Majesty Complex, near Anugrha Hospital, Near Tulsidham Char Rasta, Krupal Society, Manjalpur, Vadodara, Gujarat 390009',
    reviewQuery: 'Kathiyawadi Village, La Majesty Complex, Manjalpur, Vadodara, Gujarat 390009',
  },
  {
    slug: 'waghodia',
    name: 'Waghodia',
    capacity: '140+',
    address: 'Eastern Arcade Complex, NH 08, beside Hariyali Banquet Hall, Vadodara, Gujarat 390019',
    tag: 'Grand family dining',
    wa: '919173569597',
    mapQuery: 'Eastern Arcade Complex, NH 08, beside Hariyali Banquet Hall, Vadodara, Gujarat 390019',
    reviewQuery: 'Kathiyawadi Village, Eastern Arcade Complex, NH 08, Vadodara, Gujarat 390019',
  },
  {
    slug: 'bharuch',
    name: 'Bharuch',
    capacity: '150+',
    address: 'Vadadla NH.NO. 48, Chokdi, Haldarva, Bharuch, Gujarat 392015',
    tag: 'Largest celebration space',
    wa: '919173707651',
    mapQuery: 'Vadadla NH.NO. 48, Chokdi, Haldarva, Bharuch, Gujarat 392015',
    reviewQuery: 'Kathiyawadi Village, Vadadla NH.NO. 48, Chokdi, Haldarva, Bharuch, Gujarat 392015',
  },
  {
    slug: 'dwarka-gujarat',
    name: 'Dwarka (Gujarat)',
    capacity: 'Coming Soon',
    address: '6XR9+3C2, Shivraj Sinh Rd, Dwarka, Gujarat 361335',
    tag: 'Coastal expansion',
    wa: '919173356617',
    mapQuery: '6XR9+3C2, Shivraj Sinh Rd, Dwarka, Gujarat 361335',
    reviewQuery: 'Kathiyawadi Village, 6XR9+3C2, Shivraj Sinh Rd, Dwarka, Gujarat 361335',
  },
  {
    slug: 'new-jersey-usa',
    name: 'New Jersey (USA)',
    capacity: 'Coming Soon',
    address: '1519 Finnegans Ln, North Brunswick Township, NJ 08902, United States',
    tag: 'International expansion',
    wa: '17323056549',
    mapQuery: '1519 Finnegans Ln, North Brunswick Township, NJ 08902, United States',
    reviewQuery: 'Kathiyawadi Village, 1519 Finnegans Ln, North Brunswick Township, NJ 08902, United States',
  },
]

const expansionCities = [
  { name: 'Dubai', region: 'United Arab Emirates', image: '/images/expansion/dubai.jpg', landmark: 'Dubai skyline with Burj Khalifa' },
  { name: 'Kuala Lumpur', region: 'Malaysia', image: '/images/expansion/kuala-lumpur.jpg', landmark: 'Kuala Lumpur skyline with Petronas Twin Towers' },
  { name: 'Singapore', region: 'Singapore', image: '/images/expansion/singapore.jpg', landmark: 'Singapore Marina Bay skyline' },
  { name: 'Mumbai', region: 'Maharashtra', image: '/images/expansion/mumbai.jpg', landmark: 'Gateway of India in Mumbai' },
  { name: 'Delhi', region: 'India', image: '/images/expansion/delhi.jpg', landmark: 'India Gate in Delhi' },
  { name: 'Dwarka', region: 'Gujarat', image: '/images/expansion/dwarka.jpg', landmark: 'Dwarkadhish Temple in Dwarka' },
  { name: 'New Jersey', region: 'United States', image: '/images/expansion/new-jersey.jpg', landmark: 'New Brunswick, New Jersey skyline at sunset' },
]

const menuSections = [
  {
    category: 'Beverages',
    items: ['Plain Chhas', 'Jeera Chhas', 'Masala Chhas', 'Sweet Lassi', 'Salted Lassi', 'Dry Fruit Lassi', 'Fresh Lime Soda', 'Packaged Drinking Water', 'Aerated / Soft Drinks'],
  },
  {
    category: 'Papad / Papdi',
    items: ['Roasted Papad', 'Fried Papad', 'Masala Papad', 'Cheese Masala Papad', 'Fried Papdi', 'Masala Papdi', 'French Fries', 'Peri Peri French Fries'],
  },
  {
    category: 'Salad & Raita',
    items: ['Curd', 'Boondi Raita', 'Green Salad', 'Vegetable Raita'],
  },
  {
    category: 'Karari Roomali',
    items: ['Karari Roomali', 'Peri Peri Karari', 'Cheese Karari', 'Peri Peri Cheese Karari'],
  },
  {
    category: 'Soup',
    items: ['Tomato Cream Soup', 'Veg Sweet Corn Soup', 'Veg Manchow Soup', 'Hot & Sour Soup', 'Lemon Coriander Soup'],
  },
  {
    category: 'Appetizers',
    items: [
      'Wagharelo Rotlo',
      'Kathiyawadi Ghughra',
      'Garlic Wagharelo Rotlo',
      'Cheese Ghughra',
      'Dal Dhokli',
      'Hara Bhara Kabab',
      'Paneer Tikka',
      'Haryali Paneer Tikka',
      'Zafrani Paneer Tikka',
      'Lasaniya Paneer Tikka',
      'Vegetable Manchurian - Dry/Gravy',
      'Tandoori Mushroom',
      'Vegetable Crispy',
      'Afghani Paneer Tikka',
      'Paneer Chilly - Dry/Gravy',
      'Vegetable Spring Roll',
      'Gobi Manchurian - Dry/Gravy',
      'Cheese Stick',
    ],
  },
  {
    category: 'Kathiyawad Ni Suvas',
    items: [
      'Lilli Dungri Sev',
      'Ringan Bharthu',
      'Kaju Gathiya',
      'Kathiyawadi Ghotala',
      'Dahi Tikhari',
      'Sev Dungri Tameta',
      'Sukki Bhaji',
      'Sev Tameta',
      'Sev Dungri',
      'Lasaniya Gathiya',
      'Lasaniya Sev',
      'Lasaniya Bataka',
      'Rajwadi Dhokli',
      'Bharela Ringan',
      'Papad Bhurji',
      'Bhindi Masala',
    ],
  },
  {
    category: 'Rajasthan Ni Mahek',
    items: ['Special Dal Bati Churma', 'Dal Bati', 'Rajasthani Dal', 'Dahi Bhindi', 'Besan Gatta', 'Extra Bati'],
  },
  {
    category: 'Indian Punjabi Tadka',
    items: [
      'Cheese Butter Masala',
      'Kaju Curry',
      'Paneer Tikka Masala',
      'Kofta Nargisi Do Pyaza',
      'Palak Paneer',
      'Kadai Paneer',
      'Paneer Kolhapuri',
      'Paneer Tawa Masala',
      'Paneer Butter Masala',
      'Paneer Toofani',
      'Paneer Bhurji',
      'Paneer Angara',
      'Malai Kofta',
      'Kaju Masala',
      'Vegetable Kadai',
      'Vegetable Kolhapuri',
      'Vegetable Makhanwala',
      'Vegetable Handi',
      'Vegetable Toofani',
      'Vegetable Hariyali',
      'Mushroom Masala',
    ],
  },
  {
    category: 'Chinese Cuisine',
    items: ['Veg Fried Rice', 'Hakka Noodles', 'Schezwan Noodles', 'Manchurian Noodles', 'Manchurian Fried Rice', 'Schezwan Fried Rice', 'Chilly Garlic Fried Rice', 'Vegetable In Hot Garlic Sauce'],
  },
  {
    category: 'Tawa Ni Roti',
    items: ['Plain Phulka', 'Butter Phulka', 'Butter Tawa Paratha', 'Biscuit Bhakhri', 'Assorted Kathiyawadi Roti / Rotlo Basket (Ghee)', 'Rotlo', 'Lasaniya Rotlo', 'Ghee Rotlo', 'Ghee Lasaniya Rotlo', 'Ghee', 'Desi Gud'],
  },
  {
    category: 'Tandoor Ni Roti',
    items: ['Plain Roti', 'Butter Roti', 'Missi Roti', 'Assorted Roti Basket (Butter)', 'Plain Naan / Kulcha / Paratha', 'Butter Naan / Kulcha / Paratha', 'Garlic Naan', 'Cheese Naan', 'Garlic Cheese Naan'],
  },
  {
    category: 'Khichdi / Kadhi',
    items: ['Plain Khichdi', 'Masala Khichdi', 'Rajwadi Khichdi', 'Punjabi Dal Khichdi', 'Gujarati Kadhi', 'Rajwadi Kadhi'],
  },
  {
    category: 'Rice / Biryani',
    items: ['Steam Rice', 'Jeera Rice', 'Vegetable Pulao', 'Veg Biryani', 'Hyderabadi Biryani', 'Handi Dum Biryani', 'Matka Dum Biryani'],
  },
  {
    category: 'Dal',
    items: ['Dal Fry', 'Dal Tadka', 'Dal Palak', 'Dal Makhani'],
  },
  {
    category: 'Sweet',
    items: ['Gulab Jamun (4 Nos)', 'Churma Ladoo', 'Desi Ghee Churma', 'Rotlo And Gor Churma', 'Fried Ice Cream'],
  },
  {
    category: 'Family Celebration Menus',
    items: [
      {
        name: 'Gujarati Unlimited',
        detail: 'Starter: Mix Bhajiya / Methi Gota / Besan Na Gota. Main course: Bhindi Masala / Ghiloda / Dudhi Chana / Ringan Bataka / Methi Ringan / Rasa Bataka / Dry Bataka. Kathor: Mug Masala / Rajma Masala / Chana Masala / Chowli Masala / Vaal Masala. Includes Gujarati daal bhaat, phulka, chhas, pickle, papad, kachumber, and one sweet.',
      },
      {
        name: 'Kathiyawadi Unlimited',
        detail: 'Starter: Wagharelo Rotlo or Dal Dhokli. Main course: Sev Tamata / Lasaniya Bataka / Ringan Bharthu / Rajwadi Dhokli / Dahi Gathiya / Sev Dungri. Includes roti choices, kadhi, khichdi, chhas, pickle, papad, kachumber, and one sweet.',
      },
      {
        name: 'Punjabi Unlimited',
        detail: 'Soup: Manchow / Hot & Sour / Tomato Soup / Veg Coriander. Starter: Hara Bhara Kabab / Manchurian / Veg Crispy / Corn Tikki. Main course: one paneer item and one veg item with roti, daal, rice, accompaniments, and one sweet.',
      },
    ],
  },
]

const legalPages = {
  disclaimer: {
    eyebrow: 'Legal',
    title: 'Disclaimer',
    effectiveDate: '28 June 2026',
    intro: 'This website is owned and operated by Khodal Foods & Hospitality Pvt. Ltd. The information published here is shared in good faith for general informational purposes.',
    sections: [
      {
        heading: 'General Information',
        points: [
          'Menus, descriptions, offers, photos, and restaurant information are published for general guidance only.',
          'We try to keep every page accurate and up to date, but we do not guarantee completeness, reliability, or accuracy at all times.',
        ],
      },
      {
        heading: 'Menu, Pricing, and Food Information',
        points: [
          'Menu items, ingredients, portion sizes, pricing, and availability may vary by branch and may change without prior notice.',
          'Food photographs are for illustration only. Actual presentation can differ by location, season, and service format.',
          'Guests with allergies or dietary restrictions should inform the team before ordering.',
          'While reasonable precautions are taken, an allergen-free kitchen environment cannot be guaranteed because of shared equipment and preparation areas.',
        ],
      },
      {
        heading: 'Reservations and Service Availability',
        points: [
          'Submitting a reservation request does not guarantee confirmation.',
          'Reservations remain subject to table availability and operational requirements.',
          'Kathiyawadi Village may modify, reschedule, or cancel reservations when required for operations or guest safety.',
          'Temporary downtime caused by maintenance, connectivity issues, cybersecurity incidents, or force majeure may affect website access.',
        ],
      },
      {
        heading: 'Third-Party Links and Limitation of Liability',
        points: [
          'The website may link to third-party services such as Google Maps, Google Reviews, Facebook, Instagram, LinkedIn, WhatsApp, and online reservation platforms.',
          'We do not control third-party content, privacy practices, or service policies and are not responsible for what those services provide.',
          'Khodal Foods & Hospitality Pvt. Ltd. is not liable for direct, indirect, incidental, consequential, or special damages arising from website use, incorrect information, downtime, omissions, or reliance on third-party services.',
        ],
      },
      {
        heading: 'Intellectual Property and Updates',
        points: [
          'The logo, brand name, text, images, videos, graphics, icons, menu designs, trademarks, and website layout are the exclusive property of Khodal Foods & Hospitality Pvt. Ltd.',
          'Unauthorized copying, reproduction, modification, distribution, or commercial use is prohibited without prior written permission.',
          'This disclaimer may be updated at any time, and changes become effective when published on the website.',
        ],
      },
      {
        heading: 'Contact Information',
        points: [
          'Khodal Foods & Hospitality Pvt. Ltd.',
          'Kathiyawadi Village Restaurant, Sama-Savli Road, Vemali, Vadodara, Gujarat - 390024',
          'Phone: +91 99983 21265',
          'Email: info@kathiyawadivillage.com',
          'Website: www.kathiyawadivillage.com',
        ],
      },
    ],
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    effectiveDate: '28 June 2026',
    intro: 'Kathiyawadi Village values your privacy and is committed to protecting the personal information you share with us through this website and our services.',
    sections: [
      {
        heading: 'Company Information',
        points: [
          'Company: Khodal Foods & Hospitality Pvt. Ltd.',
          'Restaurant Brand: Kathiyawadi Village',
          'Registered Address: Sama-Savli Road, Vemali, Vadodara, Gujarat - 390024, India',
          'Phone: +91 99983 21265',
          'Email: info@kathiyawadivillage.com',
        ],
      },
      {
        heading: 'Information We Collect',
        points: [
          'Name, mobile number, email address, reservation details, event booking details, franchise enquiry information, and feedback you voluntarily submit.',
          'Technical information such as IP address, browser details, device information, cookies, and general website usage data.',
        ],
      },
      {
        heading: 'How We Use Information',
        points: [
          'To manage table bookings, party orders, event enquiries, and customer support.',
          'To respond to franchise and business enquiries.',
          'To send confirmations, improve the website experience, support security and fraud prevention, and comply with legal obligations.',
          'To share promotional communication only where permitted or requested.',
        ],
      },
      {
        heading: 'Cookies and Sharing',
        points: [
          'Cookies may be used to remember preferences, improve performance, analyze traffic, and enhance user experience. You can disable them in your browser settings.',
          'We do not sell, rent, or trade personal information.',
          'Information may be shared only with trusted service providers, when required by law, to protect legal rights, or as part of a business restructuring if applicable.',
        ],
      },
      {
        heading: 'Security, Third Parties, and Children',
        points: [
          'Administrative, technical, and physical safeguards are used to protect personal information, though no internet transmission method is completely secure.',
          'Third-party services such as Google Maps, Google Reviews, WhatsApp, Instagram, Facebook, LinkedIn, reservation tools, or payment providers maintain their own policies.',
          'This website is not intended for children under 13, and we do not knowingly collect personal information from children.',
        ],
      },
      {
        heading: 'Your Rights',
        points: [
          'You may request access to your information, correction of inaccurate details, deletion of data, withdrawal of marketing consent, or information about stored personal data.',
          'Requests can be made using the contact details below.',
        ],
      },
      {
        heading: 'Policy Updates and Contact',
        points: [
          'This privacy policy may be updated at any time. Revised versions will be published with the updated effective date.',
          'Contact: Khodal Foods & Hospitality Pvt. Ltd., Kathiyawadi Village Restaurant, Sama-Savli Road, Vemali, Vadodara, Gujarat - 390024',
          'Phone: +91 99983 21265',
          'Email: info@kathiyawadivillage.com',
          'Website: www.kathiyawadivillage.com',
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    effectiveDate: '28 June 2026',
    intro: 'These terms govern the use of the Kathiyawadi Village website and services, including reservations, enquiries, online interactions, and restaurant information.',
    sections: [
      {
        heading: 'Acceptance and Website Usage',
        points: [
          'By using this website, you confirm that you have read, understood, and agreed to these terms.',
          'The website must be used only for lawful purposes.',
          'Users must not attempt unauthorized access, upload malicious code, misrepresent their identity, or copy and distribute website content without permission.',
        ],
      },
      {
        heading: 'Reservations, Orders, and Menu Information',
        points: [
          'Reservations are subject to availability and may be modified or cancelled due to operational requirements.',
          'Guests are expected to arrive on time. Delays may affect the reservation based on availability.',
          'Menu items, offers, ingredients, and availability may vary by branch and may change without prior notice.',
          'Food images are for illustration only and may differ from actual presentation.',
          'Estimated order preparation or delivery times are approximate and may vary due to operations, traffic, weather, or festivals.',
        ],
      },
      {
        heading: 'Payments and Intellectual Property',
        points: [
          'Payments for applicable website services must be completed successfully before confirmation.',
          'Kathiyawadi Village does not store debit card, credit card, UPI, or banking credentials.',
          'The website content, including the logo, brand name, text, images, videos, graphics, icons, menu design, and website design, is the exclusive property of Khodal Foods & Hospitality Pvt. Ltd.',
          'Unauthorized copying, reproduction, or commercial use is prohibited.',
        ],
      },
      {
        heading: 'Customer Conduct and Liability',
        points: [
          'Service may be refused in cases of abusive language, threatening behaviour, harassment, illegal activities, or damage to property.',
          'Guests should inform staff about allergies or dietary restrictions before ordering.',
          'While precautions are taken, an allergen-free kitchen cannot be guaranteed.',
          'Khodal Foods & Hospitality Pvt. Ltd. is not liable for technical interruptions, third-party failures, delays caused by unforeseen circumstances, or losses arising from misuse of the website.',
        ],
      },
      {
        heading: 'Third Parties, Privacy, and Updates',
        points: [
          'The website may link to external services such as Google Maps, Google Reviews, Instagram, Facebook, LinkedIn, and WhatsApp.',
          'Use of the website is also governed by the Privacy Policy.',
          'These terms may be updated without prior notice, and changes become effective when published.',
        ],
      },
      {
        heading: 'Governing Law and Contact',
        points: [
          'These terms are governed by the laws of India.',
          'Any disputes relating to website use or services will be subject to the competent courts of Vadodara, Gujarat.',
          'Contact: Khodal Foods & Hospitality Pvt. Ltd., Kathiyawadi Village Restaurant, Sama-Savli Road, Vemali, Vadodara, Gujarat - 390024',
          'Phone: +91 99983 21265',
          'Email: info@kathiyawadivillage.com',
          'Website: www.kathiyawadivillage.com',
        ],
      },
    ],
  },
}

const whatsapp = (text, number = WA) =>
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')

const directionsLink = branch =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapQuery || branch.address)}`

const reviewsLink = branch =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.reviewQuery || branch.mapQuery || branch.address)}`

const capacityLabel = branch => (branch.capacity.includes('+') ? `${branch.capacity} Guests` : branch.capacity)
const todayValue = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
const displayTime = value => {
  const [hour, minute] = value.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const close = () => setOpen(false)

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="topline">
        <span>From Gujarat To The World</span>
        <div className="top-contact">
          <a href={`tel:${phone}`}><Phone size={12} /> {phone}</a>
          <Link className="country" to={usaLocationPath}>
            <Globe2 size={13} /> India - USA <ChevronDown size={12} />
          </Link>
        </div>
      </div>
      <div className="nav-wrap">
        <Link to="/" className="brand" onClick={close}>
          <img src="/images/kathiyawadi-village-logo-cropped.png" alt="Kathiyawadi Village - Multi Cuisine Restaurant" />
        </Link>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/" onClick={close}>Home</NavLink>
          <NavLink to="/about" onClick={close}>Our Story</NavLink>
          <div className="nav-group">
            <button type="button">Locations <ChevronDown /></button>
            <div className="nav-dropdown location-dropdown">
              {branches.map(branch => (
                <Link key={branch.slug} to={`/locations/${branch.slug}`} onClick={close}>
                  <MapPin />
                  <span><b>{branch.name}</b><small>{branch.address}</small></span>
                </Link>
              ))}
              <Link className="dropdown-all" to="/locations" onClick={close}>
                View all locations <ArrowRight />
              </Link>
            </div>
          </div>
          <NavLink to="/menu" onClick={close}>Menu</NavLink>
          <NavLink to="/party-orders" onClick={close}>Celebrations</NavLink>
          <div className="nav-group">
            <button type="button">Partner With Us <ChevronDown /></button>
            <div className="nav-dropdown partner-dropdown">
              <Link to="/franchise" onClick={close}><Building2 /><span><b>Franchise</b><small>Bring the Village to your city</small></span></Link>
              <Link to="/investors" onClick={close}><Landmark /><span><b>Investor Relations</b><small>Build the next chapter with us</small></span></Link>
            </div>
          </div>
          <div className="nav-group more">
            <button type="button">More <ChevronDown /></button>
            <div className="nav-dropdown">
              <Link to="/careers" onClick={close}>Careers</Link>
              <Link to="/contact" onClick={close}>Contact Us</Link>
            </div>
          </div>
          <div className="mobile-nav-actions">
            <button type="button" onClick={() => whatsapp('Hello Kathiyawadi Village, I would like to know more.')}>
              <FaWhatsapp /> WhatsApp Us
            </button>
            <a href="/#booking" onClick={close}>Book A Table</a>
          </div>
        </nav>
        <div className="nav-actions">
          <button className="whatsapp-btn" type="button" onClick={() => whatsapp('Hello Kathiyawadi Village, I would like to know more.')}>
            <FaWhatsapp /> WhatsApp
          </button>
          <a className="book-btn" href="/#booking">Book A Table <ArrowRight /></a>
        </div>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          {open ? <X /> : <MenuIcon />}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  const footerHighlights = [
    [Users, customerCount, 'Happy Guests'],
    [Award, '100%', 'Pure Vegetarian'],
    [Heart, 'Family', 'Friendly'],
    [CalendarDays, 'Party & Event', 'Bookings'],
    [MapPin, 'Spacious', 'Parking'],
  ]

  return (
    <>
      <section className="footer-cta">
        <div><span>Come hungry. Leave with a story.</span><h2>How can we welcome you?</h2></div>
        <div>
          <a href="/#booking"><Utensils /> Book A Table</a>
          <Link to="/party-orders"><CalendarDays /> Plan An Event</Link>
          <Link to="/franchise"><Building2 /> Franchise With Us</Link>
        </div>
      </section>
      <footer>
        <div className="footer-main">
          <div className="footer-brand-panel">
            <div className="footer-brand-card">
              <img src="/images/kathiyawadi-village-logo-cropped.png" alt="Kathiyawadi Village - Multi Cuisine Restaurant" />
              <p>From Gujarat To The World</p>
              <small>Serving authentic Kathiyawadi hospitality with timeless recipes, warm service, and family-style dining experiences.</small>
            </div>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/locations">All Locations</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-links">
            <h4>Locations</h4>
            {branches.map(branch => (
              <a href={directionsLink(branch)} target="_blank" rel="noreferrer" key={branch.slug}>
                {branch.name} <ArrowRight />
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <a href={`tel:${phone}`}><Phone /> <span><b>{phone}</b><small>Central reservations</small></span></a>
            <a href={`mailto:${email}`}><Mail /> <span><b>{email}</b><small>General enquiries</small></span></a>
            <p><Clock3 /><span><b>{hours}</b><small>Open every day</small></span></p>
            <p><MapPin /><span><b>Vadodara, Gujarat</b><small>Khodal Foods & Hospitality Pvt. Ltd.</small></span></p>
          </div>
          <div className="footer-community">
            <h4>Follow Us</h4>
            <div className="socials">
              <a aria-label="Facebook" href="https://www.facebook.com/people/Kathiyawadi-village/61577657022329/" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a aria-label="Instagram" href="https://www.instagram.com/kathiyawadi_village" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a aria-label="LinkedIn" href="https://in.linkedin.com/in/kathiyawadi-village-025b37322" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            </div>
            <div className="google-rating" aria-label="Google rating 4.7 out of 5">
              <span className="google-mark">G</span>
              <span><b>4.7</b><small>Google Rating<br />Based on 5,000+ reviews</small></span>
              <div aria-hidden="true">★★★★★</div>
            </div>
          </div>
        </div>
        <div className="footer-highlights">
          {footerHighlights.map(([Icon, title, text]) => (
            <div key={`${title}-${text}`}>
              <Icon />
              <span><b>{title}</b><small>{text}</small></span>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Khodal Foods & Hospitality Pvt. Ltd. All Rights Reserved.</span>
          <div>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <small>Authentic hospitality, one plate at a time.</small>
        </div>
        <div className="developer-credit">
          Designed &amp; Developed by
          <a href="https://apfpuniversal.com/" target="_blank" rel="noreferrer">APFP Universal</a>
        </div>
      </footer>
      <div className="mobile-bar">
        <a href={`tel:${phone}`}><Phone />Call</a>
        <Link to="/locations"><MapPin />Directions</Link>
        <button type="button" onClick={() => whatsapp('Hello, I would like to enquire.')}><FaWhatsapp />WhatsApp</button>
        <a href="/#booking"><Utensils />Book</a>
      </div>
    </>
  )
}

function SectionTitle({ eyebrow, title, text, light = false }) {
  return <div className={`section-title ${light ? 'light' : ''}`}><span>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function ExpansionCarousel() {
  const trackRef = useRef(null)
  const slide = direction => {
    trackRef.current?.scrollBy({
      left: direction * Math.min(trackRef.current.clientWidth * 0.8, 760),
      behavior: 'smooth',
    })
  }

  return (
    <section className="world section-pad">
      <div className="world-heading">
        <SectionTitle light eyebrow="Coming Soon" title="Expanding Across India & The World" text="From Gujarat to global neighbourhoods, our next chapter is already being written." />
        <div className="carousel-controls" aria-label="Expansion locations carousel controls">
          <button type="button" onClick={() => slide(-1)} aria-label="Previous locations"><ChevronLeft /></button>
          <button type="button" onClick={() => slide(1)} aria-label="Next locations"><ChevronRight /></button>
        </div>
      </div>
      <div className="expansion-track" ref={trackRef}>
        {expansionCities.map((city, index) => (
          <article className="expansion-card" key={city.name}>
            <div className={`expansion-image expansion-image-${index + 1}`}>
              <img src={city.image} alt={city.landmark} loading="lazy" />
            </div>
            <h3>{city.name}</h3>
            <p>{city.region}</p>
          </article>
        ))}
      </div>
      <div className="carousel-meta">
        <p className="carousel-hint">Swipe or use the arrows to explore</p>
      </div>
    </section>
  )
}

function BookingForm({ event = false, initialLocation = 'Sama' }) {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    location: initialLocation,
    date: '',
    time: '',
    guests: '',
    request: '',
    eventType: 'Birthday Party',
  })
  const set = e => {
    setError('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const selectedDate = form.date ? new Date(`${form.date}T12:00:00`) : null
  const isWeekend = selectedDate && [0, 6].includes(selectedDate.getDay())

  const submit = e => {
    e.preventDefault()
    if (form.date < todayValue()) {
      setError('Please choose today or a future date.')
      return
    }
    if (!event && !bookingSlots.includes(form.time)) {
      setError(`Please select a valid booking time during ${hours}.`)
      return
    }

    const branch = branches.find(item => item.name === form.location) || branches[0]
    const lead = {
      id: `KV-${Date.now()}`,
      type: event ? 'Event & Catering' : 'Table Booking',
      createdAt: new Date().toISOString(),
      name: form.name,
      mobile: form.mobile,
      location: form.location,
      eventType: event ? form.eventType : '',
      guests: form.guests,
      date: form.date,
      time: event ? '' : form.time,
      request: form.request || 'None',
      status: 'new',
    }
    persistLead(lead)

    whatsapp(
      `${event ? 'New Event & Catering Enquiry' : 'New Table Booking Inquiry'}\n\n` +
      `Lead ID: ${lead.id}\n` +
      `Name: ${form.name}\n` +
      `Mobile: ${form.mobile}\n` +
      `${event ? `Event: ${form.eventType}\n` : ''}` +
      `Branch: ${form.location}\n` +
      `Guests: ${form.guests}\n` +
      `Date: ${form.date}\n` +
      `${event ? '' : `Time: ${displayTime(form.time)}\n`}` +
      `Special Request: ${form.request || 'None'}\n\n` +
      `Restaurant Timing: ${hours}\n` +
      weekendNote,
      branch.wa,
    )
  }

  return (
    <form className="booking-form" onSubmit={submit}>
      <label><span>Name</span><input required name="name" value={form.name} onChange={set} placeholder="Your full name" /></label>
      <label><span>Mobile Number</span><input required name="mobile" value={form.mobile} onChange={set} placeholder="+91 98765 43210" /></label>
      {event && (
        <label>
          <span>Event Type</span>
          <select name="eventType" value={form.eventType} onChange={set}>
            <option>Birthday Party</option>
            <option>Anniversary Party</option>
            <option>Corporate Event</option>
            <option>Wedding Catering</option>
            <option>Outdoor Catering</option>
          </select>
        </label>
      )}
      <label>
        <span>Location</span>
        <select name="location" value={form.location} onChange={set}>
          {branches.map(branch => <option key={branch.slug}>{branch.name}</option>)}
        </select>
      </label>
      <label><span>Date</span><input required type="date" min={todayValue()} name="date" value={form.date} onChange={set} /></label>
      {!event && (
        <label>
          <span>Time</span>
          <select required name="time" value={form.time} onChange={set}>
            <option value="">Select a valid time</option>
            <optgroup label="Lunch: 11:00 AM - 3:00 PM">
              {bookingSlots.slice(0, 8).map(slot => <option value={slot} key={slot}>{displayTime(slot)}</option>)}
            </optgroup>
            <optgroup label="Dinner: 7:00 PM - 11:00 PM">
              {bookingSlots.slice(8).map(slot => <option value={slot} key={slot}>{displayTime(slot)}</option>)}
            </optgroup>
          </select>
        </label>
      )}
      <label><span>Guests</span><input required type="number" name="guests" value={form.guests} onChange={set} placeholder="e.g. 6" /></label>
      <label className="wide"><span>Special Request</span><input name="request" value={form.request} onChange={set} placeholder="Birthday, high chair, dietary note..." /></label>
      {error && <p className="booking-error wide" role="alert">{error}</p>}
      <p className={`booking-note wide ${isWeekend ? 'weekend-warning' : ''}`}><Clock3 size={15} /> Timing: {hours}. {weekendNote}</p>
      <button className="btn solid wide" type="submit"><FaWhatsapp /> Send on WhatsApp <ArrowRight size={17} /></button>
    </form>
  )
}

function Home() {
  const heroVideoRef = useRef(null)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (!heroVideoRef.current) return
      if (reducedMotion.matches) {
        heroVideoRef.current.pause()
      } else {
        heroVideoRef.current.play().catch(() => {})
      }
    }
    syncPlayback()
    reducedMotion.addEventListener('change', syncPlayback)
    return () => reducedMotion.removeEventListener('change', syncPlayback)
  }, [])

  return (
    <main>
      <section className="hero">
        <video
          ref={heroVideoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/sev-tameta-hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/sev-tameta-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <span className="eyebrow">Pure Vegetarian - Since 2014</span>
          <h1>Authentic Kathiyawadi <em>Flavours, Made Fresh.</em></h1>
          <p>From the first sizzle to the final serving, experience tradition prepared with passion and welcomed with genuine hospitality.</p>
          <div className="hero-actions">
            <a className="btn gold" href="#booking">Book Your Table <ArrowRight size={18} /></a>
            <Link className="btn glass" to="/locations">Explore Locations</Link>
          </div>
          <div className="hero-proof">
            <div><b>4.5+</b><span>Average Rating</span></div>
            <div><b>{customerCount}</b><span>{customerServedLabel}</span></div>
            <div><b>7</b><span>Locations</span></div>
          </div>
        </div>
        <div className="hero-note"><Star fill="currentColor" /><span>Made with tradition.<br /><b>Served with heart.</b></span></div>
      </section>

      <section id="booking" className="booking-section">
        <div className="booking-intro">
          <span className="eyebrow">Your table awaits</span>
          <h2>Reserve a memorable meal.</h2>
          <p>Choose your nearest Kathiyawadi Village and we will confirm your table personally on WhatsApp.</p>
          <div className="mini-trust"><Phone size={17} /><span>Need help? Call <b>{phone}</b></span></div>
        </div>
        <BookingForm />
      </section>

      <section className="signature">
        <div className="signature-image">
          <img src="/images/signature-feast.png" alt="Signature Kathiyawadi dishes" />
          <div className="dish-badge"><span>Must try</span><b>Village Feast</b></div>
        </div>
        <div className="signature-copy">
          <SectionTitle light eyebrow="Our signature dishes" title="Flavours that feel like home." text="Slow-cooked traditions, bold spices and recipes carried forward with care." />
          <div className="dish-list">
            {['Rajwadi Kaju Gathiya', 'Kathiyawadi Ghotalo', 'Garlic Wagharelo Rotlo', 'Ringan No Olo', 'Sev Tameta', 'Churma Ladoo'].map((dish, index) => (
              <div key={dish}><span>0{index + 1}</span><b>{dish}</b></div>
            ))}
          </div>
          <Link className="text-link light" to="/menu">Explore our smart menu <ArrowRight /></Link>
        </div>
      </section>

      <section className="chef-section">
        <div className="chef-portrait">
          <div className="chef-icon"><ChefHat /></div>
          <div>
            <span>Recommended by our master chef</span>
            <h3>A plate should nourish the heart before it reaches the table.</h3>
            <p>Our chefs balance traditional village recipes with the refinement and consistency a modern family restaurant deserves.</p>
          </div>
        </div>
        <div className="chef-menu">
          <span className="eyebrow">Chef's Recommendations</span>
          {['Chef Special Paneer Handi', 'Matka Paneer', 'Rajwadi Kaju Curry', 'Kathiyawadi Special Ghotalo', 'Special Punjabi Combo'].map((dish, index) => (
            <div key={dish}><b>{dish}</b><span>{index === 3 ? 'House Signature' : 'Chef Special'}</span></div>
          ))}
        </div>
      </section>

      <Stats />
      <WhyChooseUs />

      <section className="story-split">
        <div className="story-copy">
          <SectionTitle eyebrow="Khodal Foods & Hospitality" title="Rooted in Gujarat. Ready for the world." text="What began as a belief in warm, honest hospitality has grown into a family of restaurant experiences trusted by thousands." />
          <div className="story-points">
            <div><b>Our Vision</b><p>To make authentic Gujarati hospitality loved across borders.</p></div>
            <div><b>Our Mission</b><p>Consistent food, heartfelt service, and memorable spaces.</p></div>
          </div>
          <Link className="btn outline" to="/about">Discover Our Journey <ArrowRight size={17} /></Link>
        </div>
        <div className="founder-card">
          <Quote />
          <p>"Our goal is to bring authentic Kathiyawadi hospitality to every family across India and around the world."</p>
          <div><b>The Founder</b><span>Khodal Foods & Hospitality Pvt. Ltd.</span></div>
        </div>
      </section>

      <section className="events section-pad">
        <SectionTitle eyebrow="Real People. Real Experiences." title="Made for moments worth remembering." />
        <div className="event-grid">
          {[
            ['Birthday Celebrations', 'Delicious food and memorable moments.'],
            ['Anniversary Celebrations', 'Create warm memories with loved ones.'],
            ['Corporate Gatherings', 'Ideal for meetings and team events.'],
            ['Indoor & Outdoor Catering', 'Professional hospitality for every function.'],
          ].map((item, index) => (
            <div className={`event-card e${index + 1}`} key={item[0]}><span>0{index + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p></div>
          ))}
        </div>
        <Link className="btn solid center-btn" to="/party-orders">Plan Your Event <ArrowRight size={17} /></Link>
      </section>

      <LocationsPreview />

      <section className="opportunity">
        <div>
          <span className="eyebrow">Franchise Opportunity</span>
          <h2>Take authentic hospitality to your city.</h2>
          <p>Join a growing restaurant brand with a proven support system, trusted recipes, operational guidance, and ambitious expansion plans.</p>
          <Link to="/franchise" className="btn gold">Become A Franchise Partner <ArrowRight size={17} /></Link>
        </div>
        <div className="growth-card">
          <TrendingUp />
          <b>Built to grow, together.</b>
          <span>Brand - Training - Operations - Marketing</span>
        </div>
      </section>

      <section className="investor-tease">
        <div><Landmark /><span>Investor Relations</span><h2>Invest in a beloved regional brand with global ambition.</h2></div>
        <Link className="btn outline" to="/investors">Talk To Investor Relations <ArrowRight size={17} /></Link>
      </section>

      <ExpansionCarousel />
      <Gallery />
    </main>
  )
}

function Stats() {
  return (
    <section className="stats">
      {[
        [customerCount, customerServedLabel],
        ['10,000+', 'Google Reviews'],
        ['7', 'Locations'],
        ['4.5+', 'Average Rating'],
      ].map(item => <div key={item[1]}><strong>{item[0]}</strong><span>{item[1]}</span></div>)}
    </section>
  )
}

function WhyChooseUs() {
  const features = [
    [ChefHat, 'Authentic Taste', 'Traditional Kathiyawadi flavours prepared with care, balance, and rich regional character.'],
    [Award, 'Quality Ingredients', 'Fresh ingredients and careful preparation keep every dish honest, vibrant, and satisfying.'],
    [Users, 'Family Friendly', 'Comfortable seating, warm service, and a setting that works beautifully for every generation.'],
    [Heart, 'Hygienic & Safe', 'Clean kitchens, careful handling, and service standards your family can feel good about.'],
    [Star, 'Excellent Service', 'Attentive staff, timely support, and a hospitality-first experience from entry to dessert.'],
    [Utensils, 'Great Ambience', 'Thoughtful interiors and a lively, welcoming atmosphere that makes every meal feel special.'],
  ]

  return (
    <section className="why-family section-pad">
      <div className="why-family-copy">
        <span className="eyebrow">Why Family</span>
        <h2>Choose Our Restaurant</h2>
        <p>Good food, warm hospitality, and memorable moments - that's what families remember every time they visit Kathiyawadi Village.</p>
        <div className="why-family-image">
          <img src="/images/signature-feast.png" alt="Signature Kathiyawadi dishes served for families" />
        </div>
      </div>
      <div className="why-family-grid">
        {features.map(([Icon, title, text]) => (
          <article className="why-family-card" key={title}>
            <div className="why-family-icon"><Icon /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function LocationsPreview() {
  return (
    <section className="locations section-pad">
      <div className="section-head-row">
        <SectionTitle eyebrow="Our Locations" title="Your nearest Village is ready." text="Seven welcoming destinations. One standard of heartfelt hospitality." />
        <Link className="text-link" to="/locations">View all locations <ArrowRight /></Link>
      </div>
      <div className="location-grid">
        {branches.map(branch => (
          <article className="location-card" key={branch.slug}>
            <div className="location-visual"><MapPin /><span>{branch.tag}</span></div>
            <div className="location-info">
              <span>{capacityLabel(branch)}</span>
              <h3>{branch.name}</h3>
              <p>{branch.address}</p>
              <div className="location-actions">
                <a href={directionsLink(branch)} target="_blank" rel="noreferrer">Directions <ExternalLink /></a>
                <a href={reviewsLink(branch)} target="_blank" rel="noreferrer">Google Reviews</a>
                <Link to={`/locations/${branch.slug}`}>View Branch <ArrowRight /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BranchReviews({ branch }) {
  return (
    <section className="branch-reviews section-pad">
      <div className="rating">
        <span>Google Reviews</span>
        <strong>4.7</strong>
        <div>★★★★★</div>
        <p>Read latest reviews for {branch.name}</p>
      </div>
      <div className="branch-review-copy">
        <SectionTitle eyebrow="Real Guest Feedback" title={`See original reviews for ${branch.name}.`} text="Open the live Google listing to check ratings, directions, photos and recent customer experiences." />
        <div className="review-actions">
          <a className="btn solid" href={reviewsLink(branch)} target="_blank" rel="noreferrer">Open Google Reviews <ExternalLink size={17} /></a>
          <a className="btn outline" href={directionsLink(branch)} target="_blank" rel="noreferrer">Get Directions <ArrowRight size={17} /></a>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="gallery section-pad">
      <SectionTitle eyebrow="The Village Gallery" title="A glimpse of good times." />
      <div className="gallery-grid">
        <div className="g-food"><span>Food Photography</span></div>
        <div className="g-family"><span>Customer Moments</span></div>
        <div className="g-space"><span>Restaurant Interiors</span></div>
        <div className="g-event"><span>Events</span></div>
      </div>
    </section>
  )
}

function PageHero({ eyebrow, title, text }) {
  return <section className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></section>
}

function About() {
  return (
    <main>
      <PageHero eyebrow="Our Story" title="A village idea with a world-sized vision." text="The journey of Khodal Foods & Hospitality is a story of honest flavour, determined people, and an enduring belief in heartfelt service." />
      <section className="about-intro section-pad">
        <div>
          <SectionTitle eyebrow="The Beginning" title="Built on food that brings people together." />
          <p>Founded with a simple ambition to serve authentic Kathiyawadi food in a welcoming family setting, Kathiyawadi Village grew one table, one guest, and one city at a time.</p>
          <p>Today, Kathiyawadi Village welcomes families across seven locations while staying true to the authentic flavours and generous hospitality that started our journey.</p>
        </div>
        <div className="heritage-mark">Gujarat To<br /><em>The World</em><span>From Gujarat to the world</span></div>
      </section>
      <section className="timeline section-pad">
        <SectionTitle light eyebrow="Our Journey" title="Growth with gratitude." />
        <div>
          {[
            ['2014', 'The first table', 'Our authentic hospitality journey begins.'],
            ['2018', 'A family favourite', 'New locations welcome thousands of new guests.'],
            ['2023', 'Growing destinations', 'Kathiyawadi Village grows while preserving its authentic heart.'],
            ['2026', 'Seven locations', 'Dwarka and New Jersey join the expansion roadmap.'],
          ].map(item => <article key={item[0]}><b>{item[0]}</b><h3>{item[1]}</h3><p>{item[2]}</p></article>)}
        </div>
      </section>
      <section className="values section-pad">
        <SectionTitle eyebrow="Vision & Mission" title="Hospitality without borders." />
        <div className="value-grid">
          <div><Globe2 /><h3>Our Vision</h3><p>To become the world's most loved ambassador of authentic Kathiyawadi hospitality.</p></div>
          <div><Heart /><h3>Our Mission</h3><p>To give every guest generous food, thoughtful service, and a reason to return.</p></div>
          <div><Award /><h3>Our Standard</h3><p>Pure vegetarian kitchens, consistent recipes, and excellence at every table.</p></div>
        </div>
      </section>
      <section className="world section-pad">
        <SectionTitle light eyebrow="The Next Chapter" title="International Goals" text="Dubai, Malaysia, Singapore, New Jersey and the great cities of India are part of our bold next chapter." />
        <Link className="btn gold" to="/franchise">Grow With Us <ArrowRight /></Link>
      </section>
    </main>
  )
}

function Locations() {
  return (
    <main>
      <PageHero eyebrow="Find Your Village" title="Seven locations. One warm welcome." text="Discover authentic Kathiyawadi food, generous spaces and memorable family dining near you." />
      <LocationsPreview />
    </main>
  )
}

function Branch() {
  const slug = useLocation().pathname.split('/').pop()
  const branch = branches.find(item => item.slug === slug) || branches[0]
  return (
    <main>
      <PageHero eyebrow={`${branch.tag} - ${capacityLabel(branch)}`} title={`Kathiyawadi Village ${branch.name}`} text={`Perfect for family dining, birthday parties and group celebrations in ${branch.name}.`} />
      <section className="branch-grid section-pad">
        <div className="branch-details">
          <h2>Plan your visit</h2>
          <div><MapPin /><span><b>Address</b>{branch.address}</span></div>
          <div><Phone /><span><b>Contact</b>{phone}</span></div>
          <div><CalendarDays /><span><b>Hours</b>{hours}</span></div>
          <p className="branch-note">{weekendNote}</p>
          <div className="branch-buttons">
            <a className="btn solid" href={directionsLink(branch)} target="_blank" rel="noreferrer">Get Directions <ArrowRight /></a>
            <a className="btn outline" href={reviewsLink(branch)} target="_blank" rel="noreferrer">Google Reviews <ExternalLink /></a>
          </div>
        </div>
        <div className="branch-feature">
          <img src="/images/signature-feast.png" alt="Popular dishes" />
          <span>Popular at {branch.name}</span>
          <h3>Village Feast & Chef Specials</h3>
        </div>
      </section>
      <section className="booking-section">
        <div className="booking-intro">
          <span className="eyebrow">Reserve at {branch.name}</span>
          <h2>Your table is waiting.</h2>
          <p>Send a booking request and our team will confirm it on WhatsApp.</p>
        </div>
        <BookingForm initialLocation={branch.name} />
      </section>
      <BranchReviews branch={branch} />
      <Gallery />
    </main>
  )
}

function SmartMenu() {
  const cats = ['All', ...menuSections.map(section => section.category)]
  const [active, setActive] = useState('All')
  const shown = active === 'All' ? menuSections : menuSections.filter(section => section.category === active)
  return (
    <main>
      <PageHero eyebrow="Pure Veg - Multi Cuisine" title="A menu made for every mood." text="Every visible item from our Sama menu, thoughtfully organized and shown without prices." />
      <section className="menu-page section-pad">
        <div className="filters">{cats.map(cat => <button className={active === cat ? 'active' : ''} type="button" onClick={() => setActive(cat)} key={cat}>{cat}</button>)}</div>
        <div className="menu-sections">
          {shown.map(section => (
            <article className="menu-section-card" key={section.category}>
              <div className="menu-section-head">
                <span>{section.category}</span>
                <Star size={18} />
              </div>
              <div className="menu-section-list">
                {section.items.map(item => {
                  const normalized = typeof item === 'string' ? { name: item } : item
                  return (
                    <div className="menu-line" key={normalized.name}>
                      <h3>{normalized.name}</h3>
                      {normalized.detail && <p>{normalized.detail}</p>}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Party() {
  return (
    <main>
      <PageHero eyebrow="Celebrations & Catering" title="You celebrate. We handle the hospitality." text="From intimate birthdays to wedding catering, our team brings generous food and thoughtful service to every occasion." />
      <section className="services section-pad">
        {['Birthday Parties', 'Anniversary Parties', 'Corporate Events', 'Kitty Parties', 'Family Functions', 'Outdoor Catering', 'Wedding Catering'].map((service, index) => <div key={service}><span>0{index + 1}</span><h3>{service}</h3></div>)}
      </section>
      <section className="booking-section">
        <div className="booking-intro"><span className="eyebrow">Plan Your Event</span><h2>Tell us what you are celebrating.</h2><p>Share your requirements and our events team will connect with you on WhatsApp.</p></div>
        <BookingForm event />
      </section>
    </main>
  )
}

function LeadForm({ type }) {
  const [form, setForm] = useState({ name: '', mobile: '', city: '', budget: '', message: '' })
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = e => {
    e.preventDefault()
    const lead = {
      id: `KV-${Date.now()}`,
      type,
      createdAt: new Date().toISOString(),
      name: form.name,
      mobile: form.mobile,
      location: form.city,
      eventType: '',
      guests: '',
      date: '',
      time: '',
      request: form.message || 'None',
      budget: form.budget,
      status: 'new',
    }
    persistLead(lead)
    whatsapp(`New ${type} Enquiry\n\nLead ID: ${lead.id}\nName: ${form.name}\nMobile: ${form.mobile}\nCity: ${form.city}\n${form.budget ? `Budget: ${form.budget}\n` : ''}Message: ${form.message}`)
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      {['name', 'mobile', 'city'].map(field => <label key={field}><span>{field[0].toUpperCase() + field.slice(1)}</span><input required name={field} value={form[field]} onChange={change} /></label>)}
      {type === 'Franchise' && (
        <label>
          <span>Investment Budget</span>
          <select name="budget" value={form.budget} onChange={change}>
            <option value="">Select a range</option>
            <option>Rs 50L - Rs 1Cr</option>
            <option>Rs 1Cr - Rs 2Cr</option>
            <option>Rs 2Cr+</option>
          </select>
        </label>
      )}
      <label className="wide"><span>Message</span><textarea name="message" value={form.message} onChange={change} /></label>
      <button className="btn solid wide" type="submit">Send Enquiry on WhatsApp <ArrowRight /></button>
    </form>
  )
}

function Franchise() {
  return (
    <main>
      <PageHero eyebrow="Franchise Opportunity" title="Bring the Village to your city." text="Build a future-ready restaurant business with a loved Gujarati hospitality brand and an experienced operating team." />
      <section className="franchise-metrics">
        <div><b>7</b><span>Operating and upcoming locations</span></div>
        <div><b>{customerCount}</b><span>{customerServedLabel}</span></div>
        <div><b>1</b><span>Proven restaurant model</span></div>
        <div><b>Global</b><span>Expansion ambition</span></div>
      </section>
      <section className="support section-pad">
        <SectionTitle eyebrow="A Partnership Built To Perform" title="More than a franchise. A complete support system." />
        <div className="feature-grid">{['Site Selection', 'Restaurant Design', 'Kitchen & Operations', 'Training & Recruitment', 'Launch Marketing', 'Ongoing Growth'].map((item, index) => <div className="feature-card" key={item}><b>0{index + 1}</b><h3>{item}</h3><p>Hands-on guidance from an experienced hospitality team.</p></div>)}</div>
      </section>
      <section className="lead-section section-pad">
        <SectionTitle light eyebrow="Start A Conversation" title="Become a franchise partner." text="Tell us about your city and investment plan. Our expansion team will connect with you personally." />
        <LeadForm type="Franchise" />
      </section>
    </main>
  )
}

function Investors() {
  return (
    <main>
      <PageHero eyebrow="Investor Relations" title="Backing the future of authentic Indian hospitality." text="Khodal Foods & Hospitality is building a scalable, trusted restaurant brand made for India and international markets." />
      <section className="invest-grid section-pad">
        {[
          [Building2, 'Company Overview', 'A growing hospitality company built around an authentic restaurant experience.'],
          [TrendingUp, 'Growth Journey', 'From one local idea to a trusted multi-location restaurant brand.'],
          [Globe2, 'Future Expansion', 'India, Dubai, Malaysia, Singapore, New Jersey and beyond.'],
          [Landmark, 'Investor Benefits', 'A meaningful opportunity in trusted regional cuisine.'],
        ].map(([Icon, title, text]) => <div key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>)}
      </section>
      <section className="lead-section section-pad">
        <SectionTitle light eyebrow="Investor Enquiry" title="Let's build the next chapter." text="Connect directly with our investor relations team." />
        <LeadForm type="Investor Relations" />
      </section>
    </main>
  )
}

function Careers() {
  return (
    <main>
      <PageHero eyebrow="Careers" title="Build memorable hospitality with us." text="Join a team where warm service, honest effort and growth are always on the menu." />
      <section className="jobs section-pad">
        {[
          ['Restaurant Staff', 'Service associates, hosts and cashiers'],
          ['Kitchen Team', 'Chefs, cooks and kitchen stewards'],
          ['Management Team', 'Restaurant and area managers'],
          ['Corporate Team', 'Marketing, HR, finance and expansion'],
        ].map(job => <article key={job[0]}><div><h3>{job[0]}</h3><p>{job[1]}</p></div><button className="btn outline" type="button" onClick={() => whatsapp(`Hello, I would like to apply for the ${job[0]} at Kathiyawadi Village.`)}>Apply via WhatsApp <ArrowRight /></button></article>)}
      </section>
    </main>
  )
}

function Contact() {
  return (
    <main>
      <PageHero eyebrow="Contact Us" title="We would love to hear from you." text="Bookings, feedback, catering or partnerships - there is always someone ready to help." />
      <section className="contact-grid section-pad">
        <div><Phone /><h3>Call Us</h3><a href={`tel:${phone}`}>{phone}</a></div>
        <div><FaWhatsapp /><h3>WhatsApp</h3><button type="button" onClick={() => whatsapp('Hello Kathiyawadi Village, I would like to get in touch.')}>Start a conversation</button></div>
        <div><MapPin /><h3>Visit Us</h3><Link to="/locations">Explore all locations</Link></div>
        <div><Globe2 /><h3>Email</h3><a href={`mailto:${email}`}>{email}</a></div>
      </section>
    </main>
  )
}

function LegalPage({ page }) {
  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.title} text={`Effective Date: ${page.effectiveDate}`} />
      <section className="legal-page section-pad">
        <div className="legal-intro">
          <p>{page.intro}</p>
        </div>
        <div className="legal-sections">
          {page.sections.map(section => (
            <article className="legal-card" key={section.heading}>
              <h2>{section.heading}</h2>
              <ul>
                {section.points.map(point => <li key={point}>{point}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function SitemapPage() {
  const siteLinks = [
    ['Home', '/'],
    ['Our Story', '/about'],
    ['Locations', '/locations'],
    ['Menu', '/menu'],
    ['Celebrations', '/party-orders'],
    ['Franchise', '/franchise'],
    ['Investor Relations', '/investors'],
    ['Careers', '/careers'],
    ['Contact Us', '/contact'],
    ['Privacy Policy', '/privacy-policy'],
    ['Terms & Conditions', '/terms-and-conditions'],
    ['Disclaimer', '/disclaimer'],
  ]

  return (
    <main>
      <PageHero eyebrow="Website Guide" title="Sitemap" text="Quick links to the key pages across the Kathiyawadi Village website." />
      <section className="sitemap-page section-pad">
        {siteLinks.map(([label, href]) => (
          <Link className="sitemap-link" key={href} to={href}>
            <span>{label}</span>
            <ArrowRight />
          </Link>
        ))}
      </section>
    </main>
  )
}

function LeadDashboard() {
  const [session, setSession] = useState(getOwnerSession)
  const [credentials, setCredentials] = useState({
    email: import.meta.env.VITE_ADMIN_EMAIL || '',
    password: '',
  })
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    location: 'all',
    type: 'all',
    status: 'all',
    period: 'all',
    from: '',
    to: '',
    search: '',
  })

  useEffect(() => {
    if (isCloudConfigured && !session) return undefined
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchOwnerLeads(session)
        if (active) setLeads(data)
      } catch (loadError) {
        if (active) setError(loadError.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    window.addEventListener('kv-leads-updated', load)
    return () => {
      active = false
      window.removeEventListener('kv-leads-updated', load)
    }
  }, [session])

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      setLeads(await fetchOwnerLeads(session))
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  const login = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      setSession(await ownerSignIn(credentials.email, credentials.password))
      setCredentials(current => ({ ...current, password: '' }))
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    ownerSignOut()
    setSession(null)
    setLeads([])
  }

  const filteredLeads = useMemo(() => {
    const now = new Date()
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startTomorrow = new Date(startToday)
    startTomorrow.setDate(startTomorrow.getDate() + 1)
    const startYesterday = new Date(startToday)
    startYesterday.setDate(startYesterday.getDate() - 1)
    const startWeek = new Date(startToday)
    startWeek.setDate(startWeek.getDate() - startWeek.getDay())
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startYear = new Date(now.getFullYear(), 0, 1)
    const query = filters.search.trim().toLowerCase()

    return leads.filter(lead => {
      const created = new Date(lead.createdAt)
      const matchesLocation = filters.location === 'all' || lead.location === filters.location
      const matchesType = filters.type === 'all' || lead.type === filters.type
      const matchesStatus = filters.status === 'all' || (lead.status || 'new') === filters.status
      const matchesSearch = !query || [lead.id, lead.name, lead.mobile, lead.location, lead.request]
        .some(value => String(value || '').toLowerCase().includes(query))

      let matchesPeriod = true
      if (filters.period === 'today') matchesPeriod = created >= startToday && created < startTomorrow
      if (filters.period === 'yesterday') matchesPeriod = created >= startYesterday && created < startToday
      if (filters.period === 'week') matchesPeriod = created >= startWeek && created < startTomorrow
      if (filters.period === 'month') matchesPeriod = created >= startMonth && created < startTomorrow
      if (filters.period === 'year') matchesPeriod = created >= startYear && created < startTomorrow
      if (filters.period === 'custom') {
        const from = filters.from ? new Date(`${filters.from}T00:00:00`) : null
        const to = filters.to ? new Date(`${filters.to}T23:59:59`) : null
        matchesPeriod = (!from || created >= from) && (!to || created <= to)
      }

      return matchesLocation && matchesType && matchesStatus && matchesSearch && matchesPeriod
    })
  }, [filters, leads])

  const csv = useMemo(() => {
    const headers = ['ID', 'Type', 'Status', 'Created At', 'Name', 'Mobile', 'Location/City', 'Event Type', 'Guests', 'Booking Date', 'Booking Time', 'Budget', 'Request']
    const rows = filteredLeads.map(lead => [lead.id, lead.type, lead.status || 'new', lead.createdAt, lead.name, lead.mobile, lead.location, lead.eventType, lead.guests, lead.date, lead.time, lead.budget || '', lead.request])
    return [headers, ...rows].map(row => row.map(value => `"${String(value || '').replaceAll('"', '""')}"`).join(',')).join('\n')
  }, [filteredLeads])

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kathiyawadi-village-leads-${todayValue()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateStatus = async (id, status) => {
    setError('')
    try {
      await updateOwnerLeadStatus(session, id, status)
      setLeads(current => current.map(lead => lead.id === id ? { ...lead, status } : lead))
    } catch (statusError) {
      setError(statusError.message)
    }
  }

  if (!isCloudConfigured) {
    return (
      <main>
        <PageHero eyebrow="Owner CMS" title="Connect the secure lead dashboard." text="The dashboard is built and ready for its private database connection." />
        <section className="admin-login section-pad">
          <div className="admin-login-card">
            <Landmark />
            <h2>Cloud setup required</h2>
            <p>Add the Supabase URL and anonymous key from <code>.env.example</code>, run <code>supabase/schema.sql</code>, and create the owner account in Supabase Authentication.</p>
            <p className="dashboard-note">{getLocalLeads().length} lead(s) are currently held in this browser and will remain available as a fallback.</p>
          </div>
        </section>
      </main>
    )
  }

  if (!session) {
    return (
      <main>
        <PageHero eyebrow="Private Owner Access" title="Sign in to your lead dashboard." text="Bookings and enquiries are available only to authorized Kathiyawadi Village owners." />
        <section className="admin-login section-pad">
          <form className="admin-login-card" onSubmit={login}>
            <LogIn />
            <h2>Owner Login</h2>
            <label><span>Email</span><input required type="email" value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value })} /></label>
            <label><span>Password</span><input required type="password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} /></label>
            {error && <p className="booking-error" role="alert">{error}</p>}
            <button className="btn solid" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In Securely'}</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main>
      <PageHero eyebrow="Owner CMS" title="Booking and enquiry leads." text="Filter, review and manage every lead captured across Kathiyawadi Village locations." />
      <section className="lead-dashboard section-pad">
        <div className="admin-toolbar">
          <span>Signed in as <b>{session.email}</b></span>
          <button className="btn outline" type="button" onClick={logout}><LogOut size={16} /> Sign Out</button>
        </div>
        <div className="lead-summary">
          <div><b>{leads.length}</b><span>Total leads saved</span></div>
          <div><b>{filteredLeads.length}</b><span>Matching filters</span></div>
          <button className="btn solid" type="button" onClick={downloadCsv} disabled={!filteredLeads.length}><Download size={17} /> Download CSV</button>
          <button className="btn outline" type="button" onClick={refresh} disabled={loading}><RefreshCw size={17} /> {loading ? 'Loading...' : 'Refresh'}</button>
        </div>
        <div className="lead-filters">
          <label><span>Location</span><select value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}><option value="all">All locations</option>{[...new Set(leads.map(lead => lead.location).filter(Boolean))].sort().map(location => <option key={location}>{location}</option>)}</select></label>
          <label><span>Enquiry Type</span><select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}><option value="all">All types</option>{[...new Set(leads.map(lead => lead.type).filter(Boolean))].sort().map(type => <option key={type}>{type}</option>)}</select></label>
          <label><span>Status</span><select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="confirmed">Confirmed</option><option value="closed">Closed</option></select></label>
          <label><span>Received</span><select value={filters.period} onChange={e => setFilters({ ...filters, period: e.target.value })}><option value="all">All time</option><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="custom">Custom dates</option></select></label>
          {filters.period === 'custom' && <label><span>From</span><input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} /></label>}
          {filters.period === 'custom' && <label><span>To</span><input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} /></label>}
          <label className="filter-search"><span>Search</span><div><Search size={15} /><input value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} placeholder="Name, mobile or lead ID" /></div></label>
        </div>
        {error && <p className="booking-error" role="alert">{error}</p>}
        <div className="lead-table-wrap">
          <table>
            <thead><tr><th>Received</th><th>Type</th><th>Status</th><th>Name</th><th>Mobile</th><th>Location</th><th>Guests</th><th>Booking</th><th>Request</th></tr></thead>
            <tbody>
              {filteredLeads.length ? filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  <td>{lead.type}</td>
                  <td><select className={`status-select status-${lead.status || 'new'}`} value={lead.status || 'new'} onChange={e => updateStatus(lead.id, e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="confirmed">Confirmed</option><option value="closed">Closed</option></select></td>
                  <td>{lead.name}</td>
                  <td><a href={`tel:${lead.mobile}`}>{lead.mobile}</a></td>
                  <td>{lead.location}</td>
                  <td>{lead.guests || '-'}</td>
                  <td>{lead.date || '-'}{lead.time ? <><br />{displayTime(String(lead.time).slice(0, 5))}</> : ''}</td>
                  <td>{lead.request}</td>
                </tr>
              )) : <tr><td colSpan="9">No leads match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<Branch />} />
        <Route path="/menu" element={<SmartMenu />} />
        <Route path="/party-orders" element={<Party />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<LegalPage page={legalPages.privacy} />} />
        <Route path="/terms-and-conditions" element={<LegalPage page={legalPages.terms} />} />
        <Route path="/disclaimer" element={<LegalPage page={legalPages.disclaimer} />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/lead-dashboard" element={<LeadDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
