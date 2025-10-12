# HotelGo - Hotel Management System

A comprehensive hotel management software built with Next.js, TypeScript, and Tailwind CSS. HotelGo allows hotels worldwide to manage their operations efficiently with a modern, responsive interface.

## 🏨 Features

### For Hotel Owners & Staff
- **Dashboard**: Real-time overview of hotel performance, occupancy rates, and key metrics
- **Reservation Management**: Complete booking system with check-in/check-out functionality
- **Room Management**: Track room status, pricing, amenities, and maintenance
- **Staff Management**: Employee directory, role management, and attendance tracking
- **Point of Sale (POS)**: Restaurant, bar, and mini-bar sales management
- **Housekeeping**: Task assignment, room status tracking, and maintenance requests
- **Reports & Analytics**: Comprehensive reporting with visual charts and insights

### For Software Owners (Admin Panel)
- **Hotel Monitoring**: Track all registered hotels and their performance
- **Revenue Analytics**: Monitor total revenue across all hotels
- **Regional Performance**: View revenue breakdown by geographic regions
- **Activity Tracking**: Monitor hotel activities and system usage
- **Hotel Management**: Add, edit, and manage hotel accounts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel_go
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # Hotel dashboard
│   ├── reservations/      # Reservation management
│   ├── rooms/            # Room management
│   ├── staff/            # Staff management
│   ├── pos/              # Point of Sale system
│   ├── housekeeping/     # Housekeeping management
│   ├── reports/          # Reports and analytics
│   ├── login/            # Authentication pages
│   ├── register/         # Hotel registration
│   └── page.tsx          # Landing page
├── components/           # Reusable components
│   └── Layout.tsx        # Main layout component
├── data/                # Mock data and constants
│   └── mockData.ts      # Sample data for development
├── types/               # TypeScript type definitions
│   └── index.ts         # Main type definitions
└── lib/                 # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Components
- **Cards**: Consistent card design with shadows and borders
- **Buttons**: Primary, secondary, and icon buttons
- **Forms**: Styled input fields and form controls
- **Tables**: Responsive data tables
- **Modals**: Overlay dialogs for detailed views

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Responsive Design**: Mobile-first approach

## 📊 Features Overview

### Dashboard
- Real-time metrics and KPIs
- Recent activity feed
- Quick action buttons
- Upcoming check-ins/check-outs

### Reservation Management
- Guest information management
- Room assignment
- Check-in/check-out process
- Payment tracking
- Special requests handling

### Room Management
- Room inventory tracking
- Status management (available, occupied, maintenance, cleaning)
- Pricing management
- Amenities configuration
- Floor and room type organization

### Staff Management
- Employee directory
- Role-based access control
- Department management
- Shift scheduling
- Payroll information

### Point of Sale
- Menu item management
- Order processing
- Table and room service
- Payment processing
- Order status tracking

### Housekeeping
- Task assignment and tracking
- Room status updates
- Maintenance requests
- Staff productivity monitoring
- Supply management

### Reports & Analytics
- Revenue analysis
- Occupancy reports
- Guest demographics
- Room performance metrics
- Custom report generation

### Admin Panel
- Multi-hotel monitoring
- Revenue tracking across all properties
- Regional performance analysis
- Hotel account management
- System-wide analytics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@hotelgo.com or join our Slack channel.

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with AI insights
- [ ] Integration with booking platforms (Booking.com, Expedia)
- [ ] Multi-language support
- [ ] Advanced reporting with PDF export
- [ ] Inventory management system
- [ ] Customer relationship management (CRM)
- [ ] Revenue management optimization
- [ ] API for third-party integrations

---

Built with ❤️ by the HotelGo team