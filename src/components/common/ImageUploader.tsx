import axios from "axios";

export default function ImageUploader({ getData }: any) {
  const handleImageChange = async (event: any) => {
    const fileData = event.target.files[0];
    if (fileData) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(fileData);
        reader.onloadend = async () => {
          let base64Image: any;
          if (reader.result) {
            base64Image = reader.result;
          }
          const uuidv4 = () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function (c) {
                const r = (Math.random() * 16) | 0,
                  v = c == "x" ? r : (r & 0x3) | 0x8;

                return v.toString(16);
              }
            );
          };
          const fileName = uuidv4().slice(0, 32);
          // fetch("/api/upload", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ base64Image:base64Image, fileName:fileName }),
          // })
          //   .then((response) => response.json())
          //   .then((data) => console.log("data", data))
          //   .catch((error) => console.error("Error:", error));
          await axios
            .post("/api/upload", { base64Image, fileName })
            .then(async (res) => {
              if (res.status === 200) {
                // getData(fileData.name, fileName);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        };
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0xMjAtMTYwdi02NDBsNzYwIDMyMC03NjAgMzIwWm04MC0xMjAgNDc0LTIwMC00NzQtMjAwdjE0MGwyNDAgNjAtMjQwIDYwdjE0MFptMCAwdi00MDAgNDAwWiIvPjwvc3ZnPg=="
        alt=""
      /> */}
      {/* <button onClick={handleImageUpload}>Upload Image to storage account</button> */}
    </div>
  );
}
