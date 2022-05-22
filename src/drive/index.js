import { useEffect, useState } from "react";
import { AiOutlineCloud } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import style from "styled-components";
import Cat1 from "../cat1.jpeg";
import { data1 } from "../data";
import Swal from "sweetalert2";

const ImageGridDiv = style.div`
    display:flex;
  flex-direction: column;

`;

const ImageGridName = style.div`
// margin-left:2px;
margin: 0 auto;
font-size: 14px;
margin-top:5px;
`;

export default function Drive() {
  const [datum, setDatum] = useState(
    () => JSON.parse(window.localStorage.getItem("data")) || data1
  );

  const addDrive = (key) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `${data1[key].value[0]}를 추가하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            `${data1[key].value[0]}가 추가되었습니다`,
            "",
            "success"
          );

          setDatum(
            datum.map((data) => ({
              ...data,
              value: data.id === key ? data1[key].value : data.value,
            }))
          );
        }
      });
  };

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(datum));
  }, [datum]);

  const defaultImage = Array.from({ length: 32 }, () => {
    return "";
  });

  const allSelect = (key) => {
    setDatum(
      datum.map((data) => ({
        ...data,
        allCheck: data.id === key ? !data.allCheck : data.allCheck,
      }))
    );
  };

  return (
    <>
      {datum.map((item, i) => (
        <>
          {item.value !== "" ? (
            <>
              <div className="CloudUpperBox">
                <div className="CloudBox">
                  <div className="CloudBoxUp">
                    <div className="">
                      <AiOutlineCloud size="40" />
                    </div>

                    <div className="CloudBoxUpText">
                      <span className="GoogleDriveText">{item.value[0]}</span>
                      <span>sinjjang</span>
                    </div>

                    <div className="GoogleDriveCheckBox">
                      <input
                        className=""
                        type="Checkbox"
                        onChange={() => allSelect(i)}
                      />
                      <span> 전체선택</span>
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

                <div className="ImageGrid">
                  {defaultImage.map(() => (
                    <ImageGridDiv style={{ position: "relative" }}>
                      {item.allCheck ? (
                        <input
                          type="checkbox"
                          style={{ position: "absolute", top: 0, left: "0" }}
                          checked="checked"
                        />
                      ) : (
                        <></>
                      )}

                      <img src={Cat1}></img>
                      <ImageGridName>고양이.jpeg</ImageGridName>
                    </ImageGridDiv>
                  ))}
                </div>

                <div>트래픽 제한 612GB</div>
              </div>
            </>
          ) : (
            <>
              <div className="PlusButtonBox">
                <div className="PlusButton" onClick={() => addDrive(i)}>
                  <AiOutlinePlusCircle size={80}></AiOutlinePlusCircle>
                </div>
              </div>
            </>
          )}
        </>
      ))}
    </>
  );
}
