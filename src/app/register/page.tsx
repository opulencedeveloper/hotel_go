import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-primary-600">HotelGo</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Or{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="hotel-name" className="block text-sm font-medium text-secondary-700">
                Hotel Name
              </label>
              <input
                id="hotel-name"
                name="hotelName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your hotel name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-secondary-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-secondary-700">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select your currency</option>
                <option value="USD">🇺🇸 US Dollar (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
                <option value="GBP">🇬🇧 British Pound (GBP)</option>
                <option value="JPY">🇯🇵 Japanese Yen (JPY)</option>
                <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
                <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
                <option value="CHF">🇨🇭 Swiss Franc (CHF)</option>
                <option value="CNY">🇨🇳 Chinese Yuan (CNY)</option>
                <option value="SEK">🇸🇪 Swedish Krona (SEK)</option>
                <option value="NZD">🇳🇿 New Zealand Dollar (NZD)</option>
                <option value="MXN">🇲🇽 Mexican Peso (MXN)</option>
                <option value="SGD">🇸🇬 Singapore Dollar (SGD)</option>
                <option value="HKD">🇭🇰 Hong Kong Dollar (HKD)</option>
                <option value="NOK">🇳🇴 Norwegian Krone (NOK)</option>
                <option value="TRY">🇹🇷 Turkish Lira (TRY)</option>
                <option value="RUB">🇷🇺 Russian Ruble (RUB)</option>
                <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                <option value="BRL">🇧🇷 Brazilian Real (BRL)</option>
                <option value="ZAR">🇿🇦 South African Rand (ZAR)</option>
                <option value="KRW">🇰🇷 South Korean Won (KRW)</option>
                <option value="PLN">🇵🇱 Polish Zloty (PLN)</option>
                <option value="ILS">🇮🇱 Israeli Shekel (ILS)</option>
                <option value="DKK">🇩🇰 Danish Krone (DKK)</option>
                <option value="TWD">🇹🇼 Taiwan Dollar (TWD)</option>
                <option value="THB">🇹🇭 Thai Baht (THB)</option>
                <option value="MYR">🇲🇾 Malaysian Ringgit (MYR)</option>
                <option value="PHP">🇵🇭 Philippine Peso (PHP)</option>
                <option value="IDR">🇮🇩 Indonesian Rupiah (IDR)</option>
                <option value="VND">🇻🇳 Vietnamese Dong (VND)</option>
                <option value="AED">🇦🇪 UAE Dirham (AED)</option>
                <option value="SAR">🇸🇦 Saudi Riyal (SAR)</option>
                <option value="QAR">🇶🇦 Qatari Riyal (QAR)</option>
                <option value="KWD">🇰🇼 Kuwaiti Dinar (KWD)</option>
                <option value="BHD">🇧🇭 Bahraini Dinar (BHD)</option>
                <option value="OMR">🇴🇲 Omani Rial (OMR)</option>
                <option value="JOD">🇯🇴 Jordanian Dinar (JOD)</option>
                <option value="LBP">🇱🇧 Lebanese Pound (LBP)</option>
                <option value="EGP">🇪🇬 Egyptian Pound (EGP)</option>
                <option value="MAD">🇲🇦 Moroccan Dirham (MAD)</option>
                <option value="TND">🇹🇳 Tunisian Dinar (TND)</option>
                <option value="DZD">🇩🇿 Algerian Dinar (DZD)</option>
                <option value="NGN">🇳🇬 Nigerian Naira (NGN)</option>
                <option value="KES">🇰🇪 Kenyan Shilling (KES)</option>
                <option value="UGX">🇺🇬 Ugandan Shilling (UGX)</option>
                <option value="TZS">🇹🇿 Tanzanian Shilling (TZS)</option>
                <option value="ETB">🇪🇹 Ethiopian Birr (ETB)</option>
                <option value="GHS">🇬🇭 Ghanaian Cedi (GHS)</option>
                <option value="XOF">🇸🇳 West African CFA Franc (XOF)</option>
                <option value="XAF">🇨🇲 Central African CFA Franc (XAF)</option>
                <option value="MUR">🇲🇺 Mauritian Rupee (MUR)</option>
                <option value="BWP">🇧🇼 Botswanan Pula (BWP)</option>
                <option value="ZMW">🇿🇲 Zambian Kwacha (ZMW)</option>
                <option value="MWK">🇲🇼 Malawian Kwacha (MWK)</option>
                <option value="SZL">🇸🇿 Swazi Lilangeni (SZL)</option>
                <option value="LSL">🇱🇸 Lesotho Loti (LSL)</option>
                <option value="NAD">🇳🇦 Namibian Dollar (NAD)</option>
                <option value="BND">🇧🇳 Brunei Dollar (BND)</option>
                <option value="FJD">🇫🇯 Fijian Dollar (FJD)</option>
                <option value="PGK">🇵🇬 Papua New Guinea Kina (PGK)</option>
                <option value="WST">🇼🇸 Samoan Tala (WST)</option>
                <option value="TOP">🇹🇴 Tongan Pa'anga (TOP)</option>
                <option value="VUV">🇻🇺 Vanuatu Vatu (VUV)</option>
                <option value="SBD">🇸🇧 Solomon Islands Dollar (SBD)</option>
                <option value="KID">🇰🇮 Kiribati Dollar (KID)</option>
                <option value="DZD">🇩🇿 Algerian Dinar (DZD)</option>
                <option value="LYD">🇱🇾 Libyan Dinar (LYD)</option>
                <option value="SDG">🇸🇩 Sudanese Pound (SDG)</option>
                <option value="SSP">🇸🇸 South Sudanese Pound (SSP)</option>
                <option value="SOS">🇸🇴 Somali Shilling (SOS)</option>
                <option value="DJF">🇩🇯 Djiboutian Franc (DJF)</option>
                <option value="ERN">🇪🇷 Eritrean Nakfa (ERN)</option>
                <option value="CDF">🇨🇩 Congolese Franc (CDF)</option>
                <option value="RWF">🇷🇼 Rwandan Franc (RWF)</option>
                <option value="BIF">🇧🇮 Burundian Franc (BIF)</option>
                <option value="SCR">🇸🇨 Seychellois Rupee (SCR)</option>
                <option value="KMF">🇰🇲 Comorian Franc (KMF)</option>
                <option value="MGA">🇲🇬 Malagasy Ariary (MGA)</option>
                <option value="MZN">🇲🇿 Mozambican Metical (MZN)</option>
                <option value="AOA">🇦🇴 Angolan Kwanza (AOA)</option>
                <option value="ZWL">🇿🇼 Zimbabwean Dollar (ZWL)</option>
                <option value="BMD">🇧🇲 Bermudian Dollar (BMD)</option>
                <option value="BSD">🇧🇸 Bahamian Dollar (BSD)</option>
                <option value="BBD">🇧🇧 Barbadian Dollar (BBD)</option>
                <option value="BZD">🇧🇿 Belize Dollar (BZD)</option>
                <option value="XCD">🇦🇬 East Caribbean Dollar (XCD)</option>
                <option value="GYD">🇬🇾 Guyanese Dollar (GYD)</option>
                <option value="JMD">🇯🇲 Jamaican Dollar (JMD)</option>
                <option value="TTD">🇹🇹 Trinidad and Tobago Dollar (TTD)</option>
                <option value="BBD">🇧🇧 Barbadian Dollar (BBD)</option>
                <option value="AWG">🇦🇼 Aruban Florin (AWG)</option>
                <option value="ANG">🇦🇳 Netherlands Antillean Guilder (ANG)</option>
                <option value="SRD">🇸🇷 Surinamese Dollar (SRD)</option>
                <option value="CLP">🇨🇱 Chilean Peso (CLP)</option>
                <option value="COP">🇨🇴 Colombian Peso (COP)</option>
                <option value="PEN">🇵🇪 Peruvian Sol (PEN)</option>
                <option value="BOB">🇧🇴 Bolivian Boliviano (BOB)</option>
                <option value="VES">🇻🇪 Venezuelan Bolívar (VES)</option>
                <option value="UYU">🇺🇾 Uruguayan Peso (UYU)</option>
                <option value="PYG">🇵🇾 Paraguayan Guarani (PYG)</option>
                <option value="ARS">🇦🇷 Argentine Peso (ARS)</option>
                <option value="FKP">🇫🇰 Falkland Islands Pound (FKP)</option>
                <option value="GTQ">🇬🇹 Guatemalan Quetzal (GTQ)</option>
                <option value="HNL">🇭🇳 Honduran Lempira (HNL)</option>
                <option value="NIO">🇳🇮 Nicaraguan Córdoba (NIO)</option>
                <option value="CRC">🇨🇷 Costa Rican Colón (CRC)</option>
                <option value="PAB">🇵🇦 Panamanian Balboa (PAB)</option>
                <option value="DOP">🇩🇴 Dominican Peso (DOP)</option>
                <option value="HTG">🇭🇹 Haitian Gourde (HTG)</option>
                <option value="CUP">🇨🇺 Cuban Peso (CUP)</option>
                <option value="ISK">🇮🇸 Icelandic Króna (ISK)</option>
                <option value="CZK">🇨🇿 Czech Koruna (CZK)</option>
                <option value="HUF">🇭🇺 Hungarian Forint (HUF)</option>
                <option value="RON">🇷🇴 Romanian Leu (RON)</option>
                <option value="BGN">🇧🇬 Bulgarian Lev (BGN)</option>
                <option value="HRK">🇭🇷 Croatian Kuna (HRK)</option>
                <option value="RSD">🇷🇸 Serbian Dinar (RSD)</option>
                <option value="MKD">🇲🇰 Macedonian Denar (MKD)</option>
                <option value="ALL">🇦🇱 Albanian Lek (ALL)</option>
                <option value="BAM">🇧🇦 Bosnia-Herzegovina Convertible Mark (BAM)</option>
                <option value="MDL">🇲🇩 Moldovan Leu (MDL)</option>
                <option value="UAH">🇺🇦 Ukrainian Hryvnia (UAH)</option>
                <option value="BYN">🇧🇾 Belarusian Ruble (BYN)</option>
                <option value="GEL">🇬🇪 Georgian Lari (GEL)</option>
                <option value="AMD">🇦🇲 Armenian Dram (AMD)</option>
                <option value="AZN">🇦🇿 Azerbaijani Manat (AZN)</option>
                <option value="KZT">🇰🇿 Kazakhstani Tenge (KZT)</option>
                <option value="KGS">🇰🇬 Kyrgyzstani Som (KGS)</option>
                <option value="TJS">🇹🇯 Tajikistani Somoni (TJS)</option>
                <option value="TMT">🇹🇲 Turkmenistani Manat (TMT)</option>
                <option value="UZS">🇺🇿 Uzbekistani Som (UZS)</option>
                <option value="MNT">🇲🇳 Mongolian Tugrik (MNT)</option>
                <option value="LAK">🇱🇦 Lao Kip (LAK)</option>
                <option value="KHR">🇰🇭 Cambodian Riel (KHR)</option>
                <option value="MMK">🇲🇲 Myanmar Kyat (MMK)</option>
                <option value="BDT">🇧🇩 Bangladeshi Taka (BDT)</option>
                <option value="NPR">🇳🇵 Nepalese Rupee (NPR)</option>
                <option value="BTN">🇧🇹 Bhutanese Ngultrum (BTN)</option>
                <option value="MVR">🇲🇻 Maldivian Rufiyaa (MVR)</option>
                <option value="LKR">🇱🇰 Sri Lankan Rupee (LKR)</option>
                <option value="PKR">🇵🇰 Pakistani Rupee (PKR)</option>
                <option value="AFN">🇦🇫 Afghan Afghani (AFN)</option>
                <option value="IRR">🇮🇷 Iranian Rial (IRR)</option>
                <option value="IQD">🇮🇶 Iraqi Dinar (IQD)</option>
                <option value="SYP">🇸🇾 Syrian Pound (SYP)</option>
                <option value="YER">🇾🇪 Yemeni Rial (YER)</option>
                <option value="ILS">🇮🇱 Israeli Shekel (ILS)</option>
                <option value="PST">🇵🇸 Palestinian Shekel (PST)</option>
                <option value="CYP">🇨🇾 Cypriot Pound (CYP)</option>
                <option value="MTL">🇲🇹 Maltese Lira (MTL)</option>
                <option value="SIT">🇸🇮 Slovenian Tolar (SIT)</option>
                <option value="SKK">🇸🇰 Slovak Koruna (SKK)</option>
                <option value="EEK">🇪🇪 Estonian Kroon (EEK)</option>
                <option value="LVL">🇱🇻 Latvian Lats (LVL)</option>
                <option value="LTL">🇱🇹 Lithuanian Litas (LTL)</option>
                <option value="ROL">🇷🇴 Romanian Leu (ROL)</option>
                <option value="BGL">🇧🇬 Bulgarian Lev (BGL)</option>
                <option value="HRD">🇭🇷 Croatian Dinar (HRD)</option>
                <option value="YUM">🇷🇸 Yugoslav Dinar (YUM)</option>
                <option value="MKN">🇲🇰 Macedonian Denar (MKN)</option>
                <option value="ALK">🇦🇱 Albanian Lek (ALK)</option>
                <option value="BAN">🇧🇦 Bosnia-Herzegovina Dinar (BAN)</option>
                <option value="MLD">🇲🇩 Moldovan Leu (MLD)</option>
                <option value="UAK">🇺🇦 Ukrainian Karbovanets (UAK)</option>
                <option value="BYB">🇧🇾 Belarusian Ruble (BYB)</option>
                <option value="GEL">🇬🇪 Georgian Lari (GEL)</option>
                <option value="AMD">🇦🇲 Armenian Dram (AMD)</option>
                <option value="AZM">🇦🇿 Azerbaijani Manat (AZM)</option>
                <option value="KZT">🇰🇿 Kazakhstani Tenge (KZT)</option>
                <option value="KGS">🇰🇬 Kyrgyzstani Som (KGS)</option>
                <option value="TJS">🇹🇯 Tajikistani Somoni (TJS)</option>
                <option value="TMM">🇹🇲 Turkmenistani Manat (TMM)</option>
                <option value="UZS">🇺🇿 Uzbekistani Som (UZS)</option>
                <option value="MNT">🇲🇳 Mongolian Tugrik (MNT)</option>
                <option value="LAK">🇱🇦 Lao Kip (LAK)</option>
                <option value="KHR">🇰🇭 Cambodian Riel (KHR)</option>
                <option value="MMK">🇲🇲 Myanmar Kyat (MMK)</option>
                <option value="BDT">🇧🇩 Bangladeshi Taka (BDT)</option>
                <option value="NPR">🇳🇵 Nepalese Rupee (NPR)</option>
                <option value="BTN">🇧🇹 Bhutanese Ngultrum (BTN)</option>
                <option value="MVR">🇲🇻 Maldivian Rufiyaa (MVR)</option>
                <option value="LKR">🇱🇰 Sri Lankan Rupee (LKR)</option>
                <option value="PKR">🇵🇰 Pakistani Rupee (PKR)</option>
                <option value="AFN">🇦🇫 Afghan Afghani (AFN)</option>
                <option value="IRR">🇮🇷 Iranian Rial (IRR)</option>
                <option value="IQD">🇮🇶 Iraqi Dinar (IQD)</option>
                <option value="SYP">🇸🇾 Syrian Pound (SYP)</option>
                <option value="YER">🇾🇪 Yemeni Rial (YER)</option>
                <option value="ILS">🇮🇱 Israeli Shekel (ILS)</option>
                <option value="PST">🇵🇸 Palestinian Shekel (PST)</option>
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agreeTerms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-secondary-900">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
