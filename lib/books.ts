export interface BookData {
  title: string;
  author: string;
}

// English books first (they'll have cover images on Open Library),
// then Urdu/Pashto books at the end
export const books: BookData[] = [
  // === English: Fiction & Philosophy ===
  { title: "The Brothers Karamazov", author: "Fyodor Dostoyevsky" },
  { title: "Demons", author: "Fyodor Dostoyevsky" },
  { title: "White Nights", author: "Fyodor Dostoyevsky" },
  { title: "The Stranger", author: "Albert Camus" },
  { title: "The Metamorphosis", author: "Franz Kafka" },
  { title: "A Hunger Artist", author: "Franz Kafka" },
  { title: "Letters to Milena", author: "Franz Kafka" },
  { title: "The Kite Runner", author: "Khaled Hosseini" },
  { title: "A Thousand Splendid Suns", author: "Khaled Hosseini" },
  { title: "And the Mountains Echoed", author: "Khaled Hosseini" },
  { title: "The Alchemist", author: "Paulo Coelho" },
  { title: "Animal Farm", author: "George Orwell" },
  { title: "The Fault in Our Stars", author: "John Green" },
  { title: "Mr. Chips", author: "James Hilton" },
  { title: "The Bastard of Istanbul", author: "Elif Shafak" },
  { title: "Forty Rules of Love", author: "Elif Shafak" },

  // === English: Non-Fiction ===
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Think and Grow Rich", author: "Napoleon Hill" },
  { title: "The 48 Laws of Power", author: "Robert Greene" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
  { title: "The Power of Positive Thinking", author: "Norman Vincent Peale" },
  { title: "The Five Love Languages", author: "Gary Chapman" },
  { title: "The Great Philosophers", author: "Stephen Law" },
  { title: "The Psychology Book: Big Ideas Simply Explained", author: "DK" },
  { title: "Reclaim Your Heart", author: "Yasmin Mogahed" },
  { title: "The Naked Woman", author: "Desmond Morris" },
  { title: "Me & Rumi: The Autobiography of Shams-i Tabrizi", author: "William C. Chittick (trans.)" },
  { title: "The Way of Passion: A Celebration of Rumi", author: "Andrew Harvey" },
  { title: "Fragrance of Sufism", author: "M. Mahmood Ali Qutab" },

  // === English: Current Affairs & History ===
  { title: "The Afghanistan Papers", author: "Craig Whitlock" },
  { title: "In the Hands of the Taliban", author: "Yvonne Ridley" },
  { title: "The Sewing Circles of Herat", author: "Christina Lamb" },
  { title: "The War of Ideology", author: "Sami-ul-Haq" },
  { title: "After the Prophet", author: "Lesley Hazleton" },
  { title: "The Crisis of Islam", author: "Bernard Lewis" },
  { title: "Living Islam", author: "Akbar S. Ahmed" },
  { title: "The Way of Prophet Muhammad", author: "Sheikh M.S." },
  { title: "Muslim Heroes", author: "Dr. M. Esmail" },
  { title: "Why Islam is My Only Choice", author: "M. Haneef Shahid" },
  { title: "The Rightly Guided", author: "Shakil" },
  { title: "United States of Islam", author: "Jawed ul Haq Siddiqui" },
  { title: "The Islamic Guidelines", author: "Muhammad bin Jamil Zino" },

  // === Urdu: Islamic Scholarship & Sufism ===
  { title: "Kulyat-e-Iqbal", author: "Allama Muhammad Iqbal" },
  { title: "Khutbaat", author: "Dr. Zakir Naik" },
  { title: "Hikayat-e-Sahaba", author: "Maulana Muhammad Zakaria Kandhalvi" },
  { title: "Riyad-us-Saliheen", author: "S.M. Madni Abbasi" },
  { title: "Taqwiyat-ul-Iman", author: "Shah Ismail Shaheed" },
  { title: "Hujjat-ullah-ul-Baligha", author: "Ubaid Ullah Sindhi" },
  { title: "Seerat-e-Rasool", author: "Allama Suleman Nadvi" },
  { title: "Seerat-e-Rasool", author: "Prof. Noor Bakhsh" },
  { title: "Hazrat Muhammad (PBUH) Paighambar-e-Islam", author: "Muhammad Asim Butt" },
  { title: "Hazrat Muawiya Aur Tareekhi Haqaiq", author: "Mufti Muhammad Taqi Usmani" },
  { title: "Seerat-e-Amir Muawiya", author: "Kashif Ahmed" },
  { title: "Islam Aur Maghrib Ka Tasaddum", author: "Asrar-ul-Haq" },
  { title: "Islam Aur Siyasi Nazariyat", author: "Mufti Muhammad Taqi Usmani" },
  { title: "Zikr-o-Fikr", author: "Mufti Muhammad Taqi Usmani" },
  { title: "Jahan-e-Deeda", author: "Mufti Muhammad Taqi Usmani" },
  { title: "Tufaan Se Sahil Tak", author: "Muhammad Asad" },
  { title: "Zad-e-Rah", author: "Maulana Jaleel Ahsan" },
  { title: "Gunnah Ki Taseer", author: "Maulana Hidayat Ullah" },
  { title: "Khud Se Khuda Tak", author: "Muhammad Nasir Iftikhar" },
  { title: "Maulana Rumi — Hayat o Afkaar", author: "Dr. Afzal Iqbal" },
  { title: "Hikayat-e-Rumi", author: "Maulana Jalaluddin Rumi" },
  { title: "Suno Tum Sitare Ho", author: "Ali Shirazi" },
  { title: "Yani", author: "Jaun Elia" },
  { title: "Tareekh-e-Islam", author: "Kalim Ullah" },
  { title: "Pashtun Tareekh Kay Aainay Mein", author: "Syed Bahadur Shah" },
  { title: "Huzoor Ka Bachpan", author: "Shahbaz Kausar" },
  { title: "Quran Aasan", author: "Dr. Malik Ghulam" },

  // === Pashto ===
  { title: "So Panni Nasha (شعر)", author: "Waman Niyazi" },
  { title: "Da Bazgar Lor (کيسې)", author: "Noor Muhammad Tarakai" },

];
