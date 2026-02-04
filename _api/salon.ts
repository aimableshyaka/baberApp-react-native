import { api } from "./api";

export interface Salon {
  _id?: string;
  id?: string;
  salonName?: string;
  name?: string;
  location?: string;
  address?: string;
  email?: string;
  phone?: string;
  rating?: number;
  image?: string;
  distance?: number;
  description?: string;
  status?: string;
  owner?: string;
}

export interface SalonResponse {
  message?: string;
  salons?: Salon[];
  data?: Salon[];
  [key: string]: any;
}

/**
 * Fetch all salons from the backend
 * @returns Array of salons
 */
export const getAllSalons = async (): Promise<Salon[]> => {
  try {
    const response = await api.get("/api/salon");
    console.log("📋 API Response structure:", response.data);

    // Try to extract salons from various possible response formats
    let salonsData: any[] = [];

    if (Array.isArray(response.data)) {
      salonsData = response.data;
    } else if (response.data.salons && Array.isArray(response.data.salons)) {
      salonsData = response.data.salons;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      salonsData = response.data.data;
    } else {
      console.warn("⚠️ Unexpected response format:", response.data);
      salonsData = [];
    }

    console.log(`✅ Found ${salonsData.length} salons`);

    // Map API fields to our interface
    const mappedSalons: Salon[] = salonsData.map((salon) => ({
      _id: salon._id || salon.id,
      id: salon._id || salon.id,
      salonName: salon.salonName || salon.name,
      name: salon.salonName || salon.name,
      location: salon.location || salon.address,
      address: salon.location || salon.address,
      email: salon.email,
      phone: salon.phone,
      rating: salon.rating || 4.5,
      image: salon.image,
      distance: salon.distance || 5,
      description: salon.description,
      status: salon.status,
      owner: salon.owner,
    }));

    console.log("📋 Mapped salons:", mappedSalons);
    return mappedSalons;
  } catch (error: any) {
    console.error("❌ Error fetching salons:", error.message);
    console.error("❌ Full error:", error);
    throw error;
  }
};

/**
 * Fetch a single salon by ID
 * @param salonId - Salon ID
 * @returns Salon details
 */
export const getSalonById = async (salonId: string): Promise<Salon> => {
  try {
    const response = await api.get(`/api/salon/${salonId}`);
    return response.data.salon || response.data;
  } catch (error: any) {
    console.error("❌ Error fetching salon:", error);
    throw error;
  }
};

export interface WorkingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  [key: string]: any;
}

export interface Service {
  _id?: string;
  id?: string;
  serviceName?: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  [key: string]: any;
}

/**
 * Fetch working hours for a salon
 * @param salonId - Salon ID
 * @returns Working hours
 */
export const getSalonWorkingHours = async (
  salonId: string,
): Promise<WorkingHours> => {
  try {
    const response = await api.get(`/api/salon/${salonId}/working-hours`);
    console.log(`📅 Working hours for ${salonId}:`, response.data);

    // Handle different response formats
    let workingHoursData =
      response.data.workingHours || response.data.data || response.data;

    // If it's an array (from backend), transform to key-value pairs
    if (Array.isArray(workingHoursData)) {
      const hoursObj: WorkingHours = {};
      workingHoursData.forEach((item: any) => {
        if (item.day) {
          const dayName = item.day.toLowerCase();
          if (item.isOpen && item.openingTime && item.closingTime) {
            hoursObj[dayName] = `${item.openingTime} - ${item.closingTime}`;
          } else {
            hoursObj[dayName] = "Closed";
          }
        }
      });
      return hoursObj;
    }

    return workingHoursData || {};
  } catch (error: any) {
    console.error("❌ Error fetching working hours:", error.message);
    return {};
  }
};

/**
 * Fetch services for a salon
 * @param salonId - Salon ID
 * @returns Array of services
 */
export const getSalonServices = async (salonId: string): Promise<Service[]> => {
  try {
    const response = await api.get(`/api/service/${salonId}`);
    console.log(`💇 Services for ${salonId}:`, response.data);

    // Handle different response formats
    let servicesData: any[] = [];

    if (Array.isArray(response.data)) {
      servicesData = response.data;
    } else if (
      response.data.services &&
      Array.isArray(response.data.services)
    ) {
      servicesData = response.data.services;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      servicesData = response.data.data;
    } else {
      console.warn("⚠️ Unexpected services response format:", response.data);
      servicesData = [];
    }

    // Map API fields to our interface
    const mappedServices: Service[] = servicesData.map((service) => ({
      _id: service._id || service.id,
      id: service._id || service.id,
      serviceName: service.name || service.serviceName,
      name: service.name || service.serviceName,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
    }));

    return mappedServices;
  } catch (error: any) {
    console.error("❌ Error fetching services:", error.message);
    return [];
  }
};

/**
 * Search salons by name or location
 * @param query - Search query
 * @returns Array of matching salons
 */
export const searchSalons = async (query: string): Promise<Salon[]> => {
  try {
    const response = await api.get("/api/salon/search", {
      params: { q: query },
    });
    const salons = response.data.salons || response.data.data || response.data;
    return Array.isArray(salons) ? salons : [];
  } catch (error: any) {
    console.error("❌ Error searching salons:", error);
    throw error;
  }
};
