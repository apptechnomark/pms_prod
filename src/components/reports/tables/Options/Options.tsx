export const options: any = {
  responsive: "standard",
  tableBodyHeight: "75vh",
  viewColumns: false,
  filter: false,
  print: false,
  download: false,
  search: false,
  pagination: false,
  screenX: true,
  selectableRows: "none",
  selectToolbarPlacement: "none",
  draggableColumns: {
    enabled: true,
    transitionTime: 300,
  },
  elevation: 0,
  textLabels: {
    body: {
      noMatch: (
        <div className="flex items-start">
          <span>Currently there is no record available.</span>
        </div>
      ),
      toolTip: "",
    },
  },
};
