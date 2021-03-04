export default [
  {
    header: 'Sites & Plans',
  },
  {
    title: 'Sites',
    icon: 'LayoutIcon',
    children: [
      {
        title: 'All Sites',
        icon: 'GridIcon',
        route: 'sites',
      },
      {
        title: 'Add New',
        icon: 'PlusCircleIcon',
      },
    ],
  },
  {
    title: 'Plans',
    icon: 'LayersIcon',
    children: [
      {
        title: 'New Plan',
        icon: 'EditIcon',
      },
      {
        title: 'All Plans',
        icons: 'PackageIcon',
      },
    ],
  },
]
