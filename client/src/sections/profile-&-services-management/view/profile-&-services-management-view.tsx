import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { profileGet } from 'src/redux/actions';
import { AppDispatch, RootState } from 'src/redux/store';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';

import { MainProfile } from '../main-profile';
import { UpdateProfile } from '../update-profile';
import { OfferAndService } from '../offer-and-service';
import { ClientReview } from '../client-review';
import { ProviderAvailability } from '../provider-availability';
import { ProfileVerification } from '../verification';

export function ProfileAndServicesManagementView() {
  const { user } = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [showUpdateProfile, setShowUpdateProfile] = useState(false); // Toggle for edit mode
  const [showService, setShowService] = useState(false); // Toggle for edit mode
  const [updateAval, setUpdateAval] = useState(false); // Toggle for edit mode

  const [socialLinks, setSocialLinks] = useState({
    _id: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
  });

  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    username: '',
    address: '',
    experience: '',
    website: '',
    number: '',
    serviceCategory: ''
  });

  useEffect(() => {
    dispatch(profileGet(user?._id));
  }, [dispatch, user?._id]);

  const handleServiece = () => {
    setShowService(!showService)
    setShowUpdateProfile(false);
  }
  const handleAvalibility = () => {
    setUpdateAval(!updateAval)
    setShowService(false)
    setShowUpdateProfile(false);
  }

  const handleModify = useCallback((rowData: any) => {
    setShowService(false)
    setUpdateAval(false)

    setShowUpdateProfile(true); // Show UpdateProfile when Modify is clicked
    // Safely handle socialLinks (fallback to empty object if null/undefined)
    const userSocialLinks = rowData.socialLinks || {};
    setProfileData((prev) => {
      // Only update if values actually changed
      if (
        prev._id === rowData._id &&
        prev.name === rowData.name &&
        prev.email === rowData.email &&
        prev.username === rowData.username &&
        prev.address === rowData.address &&
        prev.number === rowData.number &&
        prev.website === rowData.website &&
        prev.serviceCategory === rowData.serviceCategory &&
        prev.experience === rowData.experience
      ) {
        return prev;
      }
      return {
        _id: rowData._id,
        name: rowData.name,
        email: rowData.email,
        username: rowData.username,
        address: rowData.address,
        number: rowData.number,
        website: rowData.website,
        experience: rowData.experience,
        serviceCategory: rowData.serviceCategory,
      };
    });
    setSocialLinks((prev) => {
      // Only update if values actually changed
      if (
        prev._id === userSocialLinks._id &&
        prev.instagram === userSocialLinks.instagram &&
        prev.facebook === userSocialLinks.facebook &&
        prev.linkedin === userSocialLinks.linkedin &&
        prev.tiktok === userSocialLinks.tiktok
      ) {
        return prev;
      }
      return {
        _id: userSocialLinks._id,
        instagram: userSocialLinks.instagram || '',
        facebook: userSocialLinks.facebook || '',
        linkedin: userSocialLinks.linkedin || '',
        tiktok: userSocialLinks.tiktok || '',
      };
    });
  }, []);

  return (
    <DashboardContent>
      <HeadingCommon weight={600} baseSize="30px" title="Profile & Service Manangement" />
      <MainProfile onModify={handleModify} handleAvalibility={handleAvalibility} setShowService={handleServiece} />
      {/* DJ light setion */}

      {showUpdateProfile && (
        <UpdateProfile
          setShowUpdateProfile={setShowUpdateProfile}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          setProfileData={setProfileData}
          profileData={profileData}
        />
      )}

      {/* offerd services section */}
      {showService === true && (<OfferAndService />)}
      {updateAval === true && (
        <>
          {/* Client review section */}
          <ClientReview providerId={user?._id} />

          {/* Avability section */}
          <ProviderAvailability />
        </>
      )}
      {/* Profile verification section */}
      <ProfileVerification />

    </DashboardContent>
  );
}
