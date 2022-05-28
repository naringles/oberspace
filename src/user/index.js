import { AiOutlineCloud } from "react-icons/ai";

import styled from "styled-components";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { data1 } from "../data";

export default function User() {
  const [driveMap, setDriveMap] = useState(
    () => JSON.parse(window.localStorage.getItem("data")) || data1
  );

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(driveMap));
  }, [driveMap]);

  const deleteDrive = (str, i) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `${str} 해제하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            `${str}가 해제되었습니다`,
            "",
            "success"
          );

          setDriveMap(
            driveMap.map((data) => ({
              ...data,
              value: data.id !== i ? data.value : "",
            }))
          );
          console.log(driveMap);
        }
      });
  };

  return (
    <>
      {driveMap.map((item, i) => (
        <>
          {item.value !== "" ? (
            <div className="CloudBox">
              <div className="CloudBoxUp">
                <div className="">
                  <AiOutlineCloud size="40" />
                </div>
                <div className="CloudBoxUpText">
                  <div className="GoogleDriveText">
                    {item.value[0]}
                    <span
                      className="OneDriveDel"
                      onClick={() => deleteDrive(item.value[0], i)}
                    >
                      계정해제
                    </span>
                  </div>
                  <span>string</span>
                </div>
              </div>

              <div className="ProgressDiv">
                <progress
                  value="50"
                  max="80"
                  className={
                    item.value[1] === "Progress"
                      ? "Progress"
                      : item.value[1] === "OneDriveProgress"
                      ? "OneDriveProgress"
                      : "MegaDriveProgress"
                  }
                />
              </div>

              <span className="StorageVolume">50GB / 80GB</span>
            </div>
          ) : (
            <></>
          )}
        </>
      ))}
    </>
  );
}
