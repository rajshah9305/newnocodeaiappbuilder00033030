import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample templates
  const templates = [
    {
      id: 'template-saas-dashboard',
      name: 'SaaS Dashboard',
      description: 'Complete dashboard template for SaaS applications with analytics, user management, and billing',
      category: 'Business',
      framework: 'react',
      image: '📊',
      premium: true,
      price: '$49',
      features: ['User Authentication', 'Analytics Dashboard', 'Team Management', 'API Integration', 'Responsive Design'],
      downloads: 2341,
      rating: 4.8
    },
    {
      id: 'template-ecommerce',
      name: 'E-commerce Store',
      description: 'Full-featured online store with product catalog, shopping cart, and payment integration',
      category: 'E-commerce',
      framework: 'nextjs',
      image: '🛒',
      premium: false,
      price: 'Free',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Customer Reviews'],
      downloads: 1876,
      rating: 4.7
    },
    {
      id: 'template-portfolio',
      name: 'Portfolio Website',
      description: 'Clean portfolio template for developers and designers with project showcase',
      category: 'Portfolio',
      framework: 'react',
      image: '💼',
      premium: false,
      price: 'Free',
      features: ['Project Gallery', 'Contact Form', 'SEO Optimized', 'Blog Section', 'Dark Mode'],
      downloads: 987,
      rating: 4.9
    },
    {
      id: 'template-task-manager',
      name: 'Task Management App',
      description: 'Comprehensive task management application with team collaboration features',
      category: 'Productivity',
      framework: 'react',
      image: '✅',
      premium: true,
      price: '$29',
      features: ['Task Boards', 'Team Collaboration', 'Time Tracking', 'Reports', 'Mobile Responsive'],
      downloads: 1543,
      rating: 4.6
    }
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {},
      create: template
    });
  }

  console.log('✅ Templates seeded successfully');

  // Create sample code files for templates
  const sampleCodeFiles = [
    {
      templateId: 'template-saas-dashboard',
      filename: 'components/Dashboard.tsx',
      content: `import React from 'react';
import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
          />
          <StatCard
            title="Active Users"
            value="2,350"
            change="+15% from last month"
            icon={Users}
          />
          <StatCard
            title="Conversion Rate"
            value="3.24%"
            change="+2.5% from last month"
            icon={Activity}
          />
          <StatCard
            title="Total Orders"
            value="1,429"
            change="+8.2% from last month"
            icon={BarChart3}
          />
        </div>
        
        {/* Charts and Tables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your analytics and recent activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-green-600">{change}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
}`,
      language: 'tsx',
      agent: 'ui'
    },
    {
      templateId: 'template-ecommerce',
      filename: 'components/ProductGrid.tsx',
      content: `import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={\`h-4 w-4 \${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">\${product.price}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}`,
      language: 'tsx',
      agent: 'ui'
    }
  ];

  for (const codeFile of sampleCodeFiles) {
    await prisma.codeFile.create({
      data: codeFile
    });
  }

  console.log('✅ Sample code files seeded successfully');
  console.log('🎉 Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });