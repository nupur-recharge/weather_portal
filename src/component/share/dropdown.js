import React from "react";
import { Menu, Dropdown, Space} from "antd";
import { UserOutlined } from "@ant-design/icons";

const DropDown = ({ DropDownText, Item,callbackForMenu}) => {
 
//   const handleButtonClick = (e) => {
     
//     message.info("Click on left button.");
//     console.log("click left button", e);
//   };

  const handleMenuClick = (e) => {
      callbackForMenu(e)
  };

  const menu = (
        
    <Menu onClick={handleMenuClick}>
      {
        Item && Item.map((result) => {

            return(
              <>
                <Menu.Item key={result} icon={<UserOutlined />}>
                    {result}
                </Menu.Item>
             </>
            )
          
        })
         
      } 
    </Menu>
  );

 
  return (
    <Space wrap>
      <Dropdown.Button
        // onClick={handleButtonClick}
        overlay={menu !== undefined && menu}
      >
        {DropDownText}
      </Dropdown.Button>
    </Space>
  );
};

export default DropDown;
