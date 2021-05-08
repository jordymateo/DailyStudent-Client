import { useEffect, useState } from "react";
import { InstitutionsService } from "../services";

const useUserInstitutions = () => {
  const [institutions, setInstitutions] = useState<any>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const loadInstitutions = () => {
    InstitutionsService.getUserInstitutions()
      .then((data) => {
        setInstitutions(data);
        if (data && data.length === 0)
          setIsEmpty(true);
        else {
          if (isEmpty)
            setIsEmpty(true);
        }
      });
  };

  return [institutions, loadInstitutions, isEmpty];
}

export default useUserInstitutions;