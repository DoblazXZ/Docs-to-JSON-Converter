
// Bu dosya Google Form entegrasyonuna geçildiği için devre dışı bırakılmıştır.
// Artık mail gönderimi doğrudan Google Forms üzerinden yönetilmektedir.

export const sendContactEmail = async (data: any): Promise<boolean> => {
  console.warn("Email service is deprecated. Please use the Google Form.");
  return true;
};
