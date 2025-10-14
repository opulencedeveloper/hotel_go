'use client';

import Layout from '@/components/Layout';
import { Heart, Users, Star, MessageSquare, Gift, Target, Plus, Eye, Edit, Mail, Award } from 'lucide-react';
import { mockGuestProfiles, mockLoyaltyPrograms, mockGuests } from '@/data/mockData';
import { useState } from 'react';

export default function CRMPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const loyaltyProgram = mockLoyaltyPrograms[0];
  const totalMembers = mockGuestProfiles.length;
  const goldMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'gold').length;
  const silverMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'silver').length;
  const bronzeMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'bronze').length;

  const filteredGuests = selectedTier === 'all' 
    ? mockGuestProfiles 
    : mockGuestProfiles.filter(guest => guest.loyalty_tier === selectedTier);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">CRM & Loyalty</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Guest Relationship Management</span>
                </div>
              </div>
              
              <p className="text-pink-100 text-lg mb-6">
                Build lasting relationships with your guests and drive loyalty through personalized experiences.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-pink-100">{loyaltyProgram.name} Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-pink-200">Active Members:</span>
                  <span className="font-medium">{totalMembers.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-pink-200">Avg. Satisfaction:</span>
                  <span className="font-medium">4.8/5</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Users className="w-4 h-4" />
                  <span>Guest Profiles</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Gift className="w-4 h-4" />
                  <span>Loyalty Rewards</span>
                </button>
                <button className="bg-white text-pink-600 hover:bg-pink-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Program Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Members</p>
                <p className="text-2xl font-bold text-secondary-900">{totalMembers}</p>
                <p className="text-sm text-green-600">+15% this month</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Gold Members</p>
                <p className="text-2xl font-bold text-secondary-900">{goldMembers}</p>
                <p className="text-sm text-yellow-600">{Math.round((goldMembers/totalMembers)*100)}% of total</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Silver Members</p>
                <p className="text-2xl font-bold text-secondary-900">{silverMembers}</p>
                <p className="text-sm text-gray-600">{Math.round((silverMembers/totalMembers)*100)}% of total</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Star className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Bronze Members</p>
                <p className="text-2xl font-bold text-secondary-900">{bronzeMembers}</p>
                <p className="text-sm text-orange-600">{Math.round((bronzeMembers/totalMembers)*100)}% of total</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Tiers */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">Loyalty Program Tiers</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loyaltyProgram.tiers.map((tier) => (
                <div key={tier.tier_id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-secondary-900">{tier.name}</h3>
                    <span className="text-sm text-secondary-500">{tier.min_points}+ pts</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-secondary-600">
                      {tier.discount_percentage}% discount
                    </p>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-secondary-600">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guest Profiles */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Guest Profiles</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Guest</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Guest</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Tier</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Points</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Total Stays</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Last Stay</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.guest_id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">{guest.first_name} {guest.last_name}</p>
                          <p className="text-sm text-secondary-600">{guest.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          guest.loyalty_tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                          guest.loyalty_tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                          guest.loyalty_tier === 'bronze' ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {guest.loyalty_tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-secondary-900">{guest.loyalty_points.toLocaleString()}</td>
                      <td className="py-3 px-4 text-secondary-600">{guest.total_stays}</td>
                      <td className="py-3 px-4 font-semibold text-secondary-900">${guest.total_spent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-secondary-600">{guest.last_stay || 'Never'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Edit Profile">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Send Message">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Guests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Spenders */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Top Spenders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockGuestProfiles
                  .sort((a, b) => b.total_spent - a.total_spent)
                  .slice(0, 5)
                  .map((guest, index) => (
                    <div key={guest.guest_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-pink-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{guest.first_name} {guest.last_name}</p>
                          <p className="text-sm text-secondary-600">{guest.loyalty_tier} member</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">${guest.total_spent.toLocaleString()}</p>
                        <p className="text-sm text-secondary-500">{guest.total_stays} stays</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900">New Gold member: John Doe</p>
                    <p className="text-xs text-secondary-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900">Points redeemed: Jane Smith</p>
                    <p className="text-xs text-secondary-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900">Welcome email sent to 5 new members</p>
                    <p className="text-xs text-secondary-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900">Birthday reward sent: Ahmed Hassan</p>
                    <p className="text-xs text-secondary-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900">Loyalty program updated</p>
                    <p className="text-xs text-secondary-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
