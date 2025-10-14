'use client';

import Layout from '@/components/Layout';
import { Heart, Users, Star, MessageSquare, Gift, Target, Plus, Eye, Edit, Mail, Award, X } from 'lucide-react';
import { mockGuestProfiles, mockLoyaltyPrograms, mockGuests } from '@/data/mockData';
import { useState } from 'react';

export default function CRMPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showGuestProfilesModal, setShowGuestProfilesModal] = useState(false);
  const [showLoyaltyRewardsModal, setShowLoyaltyRewardsModal] = useState(false);
  const [showSendCampaignModal, setShowSendCampaignModal] = useState(false);
  const [showRewardSelectionModal, setShowRewardSelectionModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  
  const loyaltyProgram = mockLoyaltyPrograms[0];
  const totalMembers = mockGuestProfiles.length;
  const goldMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'gold').length;
  const silverMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'silver').length;
  const bronzeMembers = mockGuestProfiles.filter(guest => guest.loyalty_tier === 'bronze').length;

  // Send Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    campaign_name: '',
    campaign_type: 'email',
    target_audience: 'all',
    subject: '',
    message: '',
    scheduled_date: '',
    scheduled_time: ''
  });

  // Reward Selection Form State
  const [rewardForm, setRewardForm] = useState({
    guest_id: '',
    guest_name: '',
    points_available: 0,
    points_required: 0,
    notes: '',
    scheduled_date: '',
    scheduled_time: ''
  });

  // Add Guest Form State
  const [addGuestForm, setAddGuestForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    id_type: 'passport',
    id_number: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    },
    loyalty_tier: 'bronze',
    preferences: []
  });

  const filteredGuests = selectedTier === 'all' 
    ? mockGuestProfiles 
    : mockGuestProfiles.filter(guest => guest.loyalty_tier === selectedTier);

  const handleSendCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending campaign:', campaignForm);
    setShowSendCampaignModal(false);
    // Reset form
    setCampaignForm({
      campaign_name: '',
      campaign_type: 'email',
      target_audience: 'all',
      subject: '',
      message: '',
      scheduled_date: '',
      scheduled_time: ''
    });
  };

  const handleRewardSelection = (reward: any) => {
    setSelectedReward(reward);
    setRewardForm({
      guest_id: '',
      guest_name: '',
      points_available: 0,
      points_required: reward.points,
      notes: '',
      scheduled_date: '',
      scheduled_time: ''
    });
    setShowRewardSelectionModal(true);
  };

  const handleRewardSelectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reward selection:', { selectedReward, rewardForm });
    setShowRewardSelectionModal(false);
    setSelectedReward(null);
    // Reset form
    setRewardForm({
      guest_id: '',
      guest_name: '',
      points_available: 0,
      points_required: 0,
      notes: '',
      scheduled_date: '',
      scheduled_time: ''
    });
  };

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new guest:', addGuestForm);
    setShowAddGuestModal(false);
    // Reset form
    setAddGuestForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      nationality: '',
      id_type: 'passport',
      id_number: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
      },
      loyalty_tier: 'bronze',
      preferences: []
    });
  };

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
                <button 
                  onClick={() => setShowGuestProfilesModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Users className="w-4 h-4" />
                  <span>Guest Profiles</span>
                </button>
                <button 
                  onClick={() => setShowLoyaltyRewardsModal(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Gift className="w-4 h-4" />
                  <span>Loyalty Rewards</span>
                </button>
                <button 
                  onClick={() => setShowSendCampaignModal(true)}
                  className="bg-white text-pink-600 hover:bg-pink-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
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
                <button 
                  onClick={() => setShowAddGuestModal(true)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
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

        {/* Guest Profiles Modal */}
        {showGuestProfilesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Guest Profiles</h2>
                <button
                  onClick={() => setShowGuestProfilesModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      <span className="font-medium text-pink-800">Total Guests</span>
                    </div>
                    <p className="text-2xl font-bold text-pink-900">{totalMembers}</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Gold Members</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{goldMembers}</p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Silver Members</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{silverMembers}</p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">Bronze Members</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{bronzeMembers}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Guest List</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary-200">
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Tier</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Points</th>
                          <th className="text-left py-3 px-4 font-medium text-secondary-600">Last Visit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuests.slice(0, 10).map((guest, index) => (
                          <tr key={index} className="border-b border-secondary-100">
                            <td className="py-3 px-4 text-sm text-secondary-900">{guest.first_name} {guest.last_name}</td>
                            <td className="py-3 px-4 text-sm text-secondary-900">{guest.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                guest.loyalty_tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                                guest.loyalty_tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {guest.loyalty_tier.charAt(0).toUpperCase() + guest.loyalty_tier.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-secondary-900">{guest.loyalty_points}</td>
                            <td className="py-3 px-4 text-sm text-secondary-900">{guest.last_stay || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowGuestProfilesModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Rewards Modal */}
        {showLoyaltyRewardsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Loyalty Rewards</h2>
                <button
                  onClick={() => setShowLoyaltyRewardsModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Gift className="w-6 h-6 text-pink-600" />
                      <h3 className="text-lg font-semibold text-pink-800">Current Program</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-pink-700">Program Name</span>
                        <span className="font-medium text-pink-900">{loyaltyProgram.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-700">Points per $1</span>
                        <span className="font-medium text-pink-900">1 point</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-700">Redemption Rate</span>
                        <span className="font-medium text-pink-900">100 pts = $1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-700">Status</span>
                        <span className="font-medium text-pink-900">{loyaltyProgram.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Target className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">Reward Tiers</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Bronze (0-999 points)</span>
                        <span className="font-medium text-blue-900">5% discount</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Silver (1000-4999 points)</span>
                        <span className="font-medium text-blue-900">10% discount</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Gold (5000+ points)</span>
                        <span className="font-medium text-blue-900">15% discount + perks</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Available Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Free Room Upgrade', points: 2000, description: 'Upgrade to next room category' },
                      { name: 'Complimentary Breakfast', points: 500, description: 'Free breakfast for 2 guests' },
                      { name: 'Late Checkout', points: 300, description: 'Checkout until 2 PM' },
                      { name: 'Spa Credit', points: 1000, description: '$50 spa service credit' }
                    ].map((reward, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleRewardSelection(reward)}
                        className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 hover:border-pink-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-secondary-900">{reward.name}</h4>
                          <span className="text-sm font-medium text-pink-600">{reward.points} pts</span>
                        </div>
                        <p className="text-sm text-secondary-600">{reward.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-secondary-500">Click to select</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-green-600 font-medium">Available</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 mt-6">
                <button
                  onClick={() => setShowLoyaltyRewardsModal(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Campaign Modal */}
        {showSendCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Send Campaign</h2>
                <button
                  onClick={() => setShowSendCampaignModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSendCampaignSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={campaignForm.campaign_name}
                      onChange={(e) => setCampaignForm({...campaignForm, campaign_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Campaign name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Campaign Type
                    </label>
                    <select
                      value={campaignForm.campaign_type}
                      onChange={(e) => setCampaignForm({...campaignForm, campaign_type: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Notification</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={campaignForm.target_audience}
                      onChange={(e) => setCampaignForm({...campaignForm, target_audience: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Guests</option>
                      <option value="gold">Gold Members</option>
                      <option value="silver">Silver Members</option>
                      <option value="bronze">Bronze Members</option>
                      <option value="inactive">Inactive Guests</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Campaign subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={campaignForm.scheduled_date}
                      onChange={(e) => setCampaignForm({...campaignForm, scheduled_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={campaignForm.scheduled_time}
                      onChange={(e) => setCampaignForm({...campaignForm, scheduled_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={campaignForm.message}
                      onChange={(e) => setCampaignForm({...campaignForm, message: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your campaign message..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowSendCampaignModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reward Selection Modal */}
        {showRewardSelectionModal && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Select Reward</h2>
                <button
                  onClick={() => setShowRewardSelectionModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Selected Reward Display */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-pink-800">{selectedReward.name}</h3>
                  <span className="text-lg font-bold text-pink-600">{selectedReward.points} pts</span>
                </div>
                <p className="text-pink-700">{selectedReward.description}</p>
              </div>
              
              <form onSubmit={handleRewardSelectionSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Guest ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={rewardForm.guest_id}
                      onChange={(e) => setRewardForm({...rewardForm, guest_id: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter guest ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rewardForm.guest_name}
                      onChange={(e) => setRewardForm({...rewardForm, guest_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter guest name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Points Available
                    </label>
                    <input
                      type="number"
                      value={rewardForm.points_available}
                      onChange={(e) => setRewardForm({...rewardForm, points_available: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Points Required
                    </label>
                    <input
                      type="number"
                      value={rewardForm.points_required}
                      readOnly
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={rewardForm.scheduled_date}
                      onChange={(e) => setRewardForm({...rewardForm, scheduled_date: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={rewardForm.scheduled_time}
                      onChange={(e) => setRewardForm({...rewardForm, scheduled_time: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={rewardForm.notes}
                      onChange={(e) => setRewardForm({...rewardForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes or special instructions..."
                    />
                  </div>
                </div>
                
                {/* Points Balance Check */}
                {rewardForm.points_available > 0 && (
                  <div className={`p-4 rounded-lg border ${
                    rewardForm.points_available >= rewardForm.points_required 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {rewardForm.points_available >= rewardForm.points_required ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                      )}
                      <span className={`font-medium ${
                        rewardForm.points_available >= rewardForm.points_required 
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        {rewardForm.points_available >= rewardForm.points_required 
                          ? `Sufficient points available (${rewardForm.points_available - rewardForm.points_required} remaining)`
                          : `Insufficient points (need ${rewardForm.points_required - rewardForm.points_available} more)`
                        }
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowRewardSelectionModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={rewardForm.points_available < rewardForm.points_required}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem Reward
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Guest Modal */}
        {showAddGuestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Add New Guest</h2>
                <button
                  onClick={() => setShowAddGuestModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddGuestSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addGuestForm.first_name}
                      onChange={(e) => setAddGuestForm({...addGuestForm, first_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addGuestForm.last_name}
                      onChange={(e) => setAddGuestForm({...addGuestForm, last_name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={addGuestForm.email}
                      onChange={(e) => setAddGuestForm({...addGuestForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addGuestForm.phone}
                      onChange={(e) => setAddGuestForm({...addGuestForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={addGuestForm.date_of_birth}
                      onChange={(e) => setAddGuestForm({...addGuestForm, date_of_birth: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.nationality}
                      onChange={(e) => setAddGuestForm({...addGuestForm, nationality: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter nationality"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      ID Type
                    </label>
                    <select
                      value={addGuestForm.id_type}
                      onChange={(e) => setAddGuestForm({...addGuestForm, id_type: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.id_number}
                      onChange={(e) => setAddGuestForm({...addGuestForm, id_number: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter ID number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.address.street}
                      onChange={(e) => setAddGuestForm({
                        ...addGuestForm, 
                        address: {...addGuestForm.address, street: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.address.city}
                      onChange={(e) => setAddGuestForm({
                        ...addGuestForm, 
                        address: {...addGuestForm.address, city: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.address.state}
                      onChange={(e) => setAddGuestForm({
                        ...addGuestForm, 
                        address: {...addGuestForm.address, state: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter state/province"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.address.country}
                      onChange={(e) => setAddGuestForm({
                        ...addGuestForm, 
                        address: {...addGuestForm.address, country: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={addGuestForm.address.postal_code}
                      onChange={(e) => setAddGuestForm({
                        ...addGuestForm, 
                        address: {...addGuestForm.address, postal_code: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter postal code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Loyalty Tier
                    </label>
                    <select
                      value={addGuestForm.loyalty_tier}
                      onChange={(e) => setAddGuestForm({...addGuestForm, loyalty_tier: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setShowAddGuestModal(false)}
                    className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
