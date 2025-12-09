import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { CONFIG } from 'src/config-global';
import { RootState } from 'src/redux/store';
import { SingleCategoriesView } from 'src/sections/category/single-category/single-category';

// ----------------------------------------------------------------------

export default function Page() {
  const { _id, name, cover, subcategories, events } = useSelector((state: RootState) => state?.event?.category);

  return (
    <>
      <Helmet>
        <title>{name ? `${name} Events | Tick-M Cloud` : "Category | Tick-M Cloud"}</title>

        <meta
          name="description"
          content={
            name
              ? `Explore upcoming ${name} events. Find subcategories like ${subcategories?.map((s: { _id: string; name: string }) => s.name).join(", ")
              }`
              : "Browse events by category on Tick-M Cloud."
          }

        />

        <meta property="og:title" content={name ? `${name} Events` : "Category"} />
        <meta
          property="og:description"
          content={
            name
              ? `Discover ${events?.length || 0} events available in ${name}.`
              : "Explore event categories at Tick-M Cloud."
          }
        />
        <meta property="og:image" content={cover?.url || "https://tick-m.cloud/default-category.jpg"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tick-m.cloud/category/${_id}`} />

        <link rel="canonical" href={`https://tick-m.cloud/category/${_id}`} />
      </Helmet>

      <SingleCategoriesView />
    </>
  );
}
