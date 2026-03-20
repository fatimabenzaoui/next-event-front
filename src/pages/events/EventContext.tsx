import { createContext, useContext, useState, useMemo, type ReactNode, useEffect } from 'react';
import { findAllCities } from '../../services/CityService';
import { findAllSchools } from '../../services/SchoolService';
import { findAllAssociations } from '../../services/AssociationService';
import { findAllEventCategories } from '../../services/EventCategoryService';
import type { City } from '../../models/City';
import type { School } from '../../models/School';
import type { Association } from '../../models/Association';
import type { EventCategory } from '../../models/EventCategory';

interface EventContextType {
  selectedCity: number | null;
  setSelectedCity: (city: number | null) => void;
  selectedSchool: number | null;
  setSelectedSchool: (school: number | null) => void;
  selectedAssociation: number | null;
  setSelectedAssociation: (association: number | null) => void;
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  showSchoolMap: boolean;
  setShowSchoolMap: (show: boolean) => void;

  isEpitechCampusActive: boolean;
  setIsEpitechCampusActive: (active: boolean) => void;
  isEpitechAssosActive: boolean;
  setIsEpitechAssosActive: (active: boolean) => void;

  cities: City[];
  setCities: (cities: City[]) => void;
  schools: School[];
  setSchools: (schools: School[]) => void;
  associations: Association[];
  setAssociations: (associations: Association[]) => void;
  categories: EventCategory[];
  setCategories: (categories: EventCategory[]) => void;
  loadData: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showSchoolMap, setShowSchoolMap] = useState<boolean>(false);
  const [isEpitechCampusActive, setIsEpitechCampusActive] = useState<boolean>(false);
  const [isEpitechAssosActive, setIsEpitechAssosActive] = useState<boolean>(false);

  const [cities, setCities] = useState<City[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [cityData, schoolData, associationData, categoryData] = await Promise.all([
        findAllCities(),
        findAllSchools(),
        findAllAssociations(),
        findAllEventCategories(),
      ]);
      setCities(cityData);
      setSchools(schoolData);
      setAssociations(associationData);
      setCategories(categoryData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load data :", error);
      setIsLoading(false);
    }
  };

  // Charge les données au montage du provider
  useEffect(() => {
    loadData();
  }, []);

  const contextValue = useMemo(() => ({ 
    selectedCity, setSelectedCity, 
    selectedSchool, setSelectedSchool, 
    selectedAssociation, setSelectedAssociation, 
    selectedCategory, setSelectedCategory, 
    showSchoolMap, setShowSchoolMap,
    isEpitechCampusActive, setIsEpitechCampusActive,
    isEpitechAssosActive, setIsEpitechAssosActive,

    cities, setCities,
    schools, setSchools,
    associations, setAssociations,
    categories, setCategories,
    loadData, isLoading,
  }), [selectedCity, selectedSchool, selectedAssociation, selectedCategory, showSchoolMap, isEpitechCampusActive, isEpitechAssosActive,
    cities, schools, associations, categories, isLoading,
  ]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};



